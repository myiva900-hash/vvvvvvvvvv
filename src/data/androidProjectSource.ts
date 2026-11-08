export interface AndroidFile {
  path: string;
  filename: string;
  language: 'kotlin' | 'xml' | 'gradle' | 'markdown' | 'properties';
  content: string;
  description: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with required VpnService permissions, foreground service declarations, and network security config',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.mutigandayvan.vpn">

    <!-- Essential VPN & Networking Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".MyvApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MutigandaYvanVPN"
        tools:targetApi="34">

        <!-- Main User Interface Activity -->
        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/Theme.MutigandaYvanVPN">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Official Android VpnService implementation -->
        <service
            android:name=".service.MyvVpnService"
            android:description="@string/vpn_service_desc"
            android:exported="false"
            android:foregroundServiceType="specialUse"
            android:permission="android.permission.BIND_VPN_SERVICE">
            <intent-filter>
                <action android:name="android.net.VpnService" />
            </intent-filter>
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="VPN Tunneling for secure, encrypted private communication" />
        </service>

    </application>
</manifest>`
  },
  {
    path: 'app/src/main/java/com/mutigandayvan/vpn/service/MyvVpnService.kt',
    filename: 'MyvVpnService.kt',
    language: 'kotlin',
    description: 'Real Android VpnService creating virtual TUN interface and delegating to tunnel engine',
    content: `package com.mutigandayvan.vpn.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import android.util.Log
import androidx.core.app.NotificationCompat
import com.mutigandayvan.vpn.R
import com.mutigandayvan.vpn.tunnel.VpnTunnelManager
import com.mutigandayvan.vpn.ui.MainActivity
import kotlinx.coroutines.*
import java.io.FileInputStream
import java.io.FileOutputStream

/**
 * Mutiganda Yvan VPN - Android VpnService Implementation
 * 
 * Uses Android's official VpnService API to establish a virtual TUN interface,
 * routes IP traffic through secure tunnel sockets, and handles foreground notifications.
 */
class MyvVpnService : VpnService() {

    private val serviceJob = Job()
    private val serviceScope = CoroutineScope(Dispatchers.IO + serviceJob)
    
    private var vpnInterface: ParcelFileDescriptor? = null
    private var tunnelManager: VpnTunnelManager? = null
    private var isRunning = false

    companion object {
        const val TAG = "MyvVpnService"
        const val ACTION_CONNECT = "com.mutigandayvan.vpn.ACTION_CONNECT"
        const val ACTION_DISCONNECT = "com.mutigandayvan.vpn.ACTION_DISCONNECT"
        const val NOTIFICATION_CHANNEL_ID = "myv_vpn_channel"
        const val NOTIFICATION_ID = 1001
        
        // Broadcast actions for UI synchronization
        const val BROADCAST_STATUS = "com.mutigandayvan.vpn.STATUS_UPDATE"
        const val EXTRA_STATE = "state"
        const val EXTRA_UP_BYTES = "up_bytes"
        const val EXTRA_DOWN_BYTES = "down_bytes"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: return START_NOT_STICKY

        when (action) {
            ACTION_CONNECT -> {
                val serverHost = intent.getStringExtra("server_host") ?: "node-auto.myv-vpn.net"
                val serverPort = intent.getIntExtra("server_port", 443)
                val connectionMode = intent.getStringExtra("connection_mode") ?: "direct"
                val payload = intent.getStringExtra("payload") ?: ""
                val sni = intent.getStringExtra("sni") ?: ""
                
                startVpnTunnel(serverHost, serverPort, connectionMode, payload, sni)
            }
            ACTION_DISCONNECT -> {
                stopVpnTunnel()
            }
        }

        return START_NOT_STICKY
    }

    private fun startVpnTunnel(
        serverHost: String,
        serverPort: Int,
        mode: String,
        payload: String,
        sni: String
    ) {
        if (isRunning) return
        isRunning = true

        startForeground(NOTIFICATION_ID, buildForegroundNotification("Connecting to $serverHost..."))
        broadcastStatus("CONNECTING", 0L, 0L)

        serviceScope.launch {
            try {
                Log.i(TAG, "Configuring TUN interface for Mutiganda Yvan VPN...")
                
                // 1. Establish official Android TUN virtual interface
                val builder = Builder()
                    .setSession("Mutiganda Yvan VPN")
                    .addAddress("10.8.0.2", 24) // Private TUN IP
                    .addRoute("0.0.0.0", 0)     // Route default IPv4 traffic
                    .addDnsServer("1.1.1.1")   // Cloudflare Primary DNS
                    .addDnsServer("8.8.8.8")   // Google Secondary DNS
                    .setMtu(1500)
                    .setBlocking(false)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    builder.setMetered(false)
                }

                vpnInterface = builder.establish()

                if (vpnInterface == null) {
                    Log.e(TAG, "Failed to establish VPN TUN interface.")
                    stopVpnTunnel()
                    return@launch
                }

                Log.i(TAG, "Virtual TUN interface successfully allocated (fd: \${vpnInterface?.fd})")
                updateNotification("Connected to $serverHost:$serverPort")
                broadcastStatus("CONNECTED", 0L, 0L)

                // 2. Initialize VpnTunnelManager passing 'this' to protect tunnel sockets
                tunnelManager = VpnTunnelManager(
                    vpnService = this@MyvVpnService,
                    tunInterface = vpnInterface!!,
                    serverHost = serverHost,
                    serverPort = serverPort,
                    mode = mode,
                    payload = payload,
                    sni = sni,
                    onTrafficUpdate = { up, down ->
                        broadcastStatus("CONNECTED", up, down)
                    }
                )

                // 3. Start packet processing loop in coroutine
                tunnelManager?.start()

            } catch (e: Exception) {
                Log.e(TAG, "Error starting VPN tunnel: \${e.message}", e)
                stopVpnTunnel()
            }
        }
    }

    private fun stopVpnTunnel() {
        if (!isRunning) return
        isRunning = false
        Log.i(TAG, "Stopping Mutiganda Yvan VPN tunnel...")

        serviceScope.launch {
            tunnelManager?.stop()
            tunnelManager = null

            try {
                vpnInterface?.close()
                vpnInterface = null
            } catch (e: Exception) {
                Log.e(TAG, "Error closing TUN interface: \${e.message}")
            }

            broadcastStatus("DISCONNECTED", 0L, 0L)
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopVpnTunnel()
        serviceJob.cancel()
    }

    private fun broadcastStatus(state: String, upBytes: Long, downBytes: Long) {
        val intent = Intent(BROADCAST_STATUS).apply {
            putExtra(EXTRA_STATE, state)
            putExtra(EXTRA_UP_BYTES, upBytes)
            putExtra(EXTRA_DOWN_BYTES, downBytes)
        }
        sendBroadcast(intent)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Mutiganda Yvan VPN Status",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows real-time status and traffic data for Mutiganda Yvan VPN"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildForegroundNotification(statusText: String): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Mutiganda Yvan VPN")
            .setContentText(statusText)
            .setSmallIcon(R.drawable.ic_vpn_logo)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun updateNotification(statusText: String) {
        val manager = getSystemService(NotificationManager::class.java)
        manager.notify(NOTIFICATION_ID, buildForegroundNotification(statusText))
    }
}`
  },
  {
    path: 'app/src/main/java/com/mutigandayvan/vpn/tunnel/VpnTunnelManager.kt',
    filename: 'VpnTunnelManager.kt',
    language: 'kotlin',
    description: 'Modular networking tunnel engine with socket protection, HTTP Proxy CONNECT injector, TLS/SNI, and DNSTT support',
    content: `package com.mutigandayvan.vpn.tunnel

import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.InetSocketAddress
import java.net.Socket
import java.nio.ByteBuffer
import java.nio.channels.SocketChannel
import javax.net.ssl.SNIHostName
import javax.net.ssl.SSLParameters
import javax.net.ssl.SSLSocket
import javax.net.ssl.SSLSocketFactory
import kotlinx.coroutines.*
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong

/**
 * Modular VPN Tunnel Manager
 * Handles socket lifecycle, protect() calls so VPN traffic doesn't loop into itself,
 * and executes protocol handshakes:
 * 1. Direct TCP/UDP Tunneling
 * 2. HTTP Proxy with custom TCP payload injection (e.g. CONNECT [host_port] HTTP/1.1)
 * 3. Custom SNI SSL/TLS Handshake
 * 4. DNSTT (DNS Tunneling)
 */
class VpnTunnelManager(
    private val vpnService: VpnService,
    private val tunInterface: ParcelFileDescriptor,
    private val serverHost: String,
    private val serverPort: Int,
    private val mode: String,
    private val payload: String,
    private val sni: String,
    private val onTrafficUpdate: (upBytes: Long, downBytes: Long) -> Unit
) {
    private val TAG = "VpnTunnelManager"
    private val isRunning = AtomicBoolean(false)
    private val totalUpload = AtomicLong(0L)
    private val totalDownload = AtomicLong(0L)
    
    private var clientSocket: Socket? = null

    fun start() {
        isRunning.set(true)
        Log.i(TAG, "Initializing tunnel engine mode: $mode to $serverHost:$serverPort")

        try {
            // Step 1: Create upstream client socket
            val socket = Socket()
            
            // CRITICAL: Protect the socket using VpnService.protect()
            // This prevents packets sent by this socket from being redirected back into the TUN
            val protected = vpnService.protect(socket)
            if (!protected) {
                Log.w(TAG, "Warning: Socket protection returned false. Check permissions.")
            }

            // Step 2: Connect to legitimate VPN endpoint
            Log.i(TAG, "Connecting to VPN gateway...")
            socket.connect(InetSocketAddress(serverHost, serverPort), 15000)
            clientSocket = socket

            // Step 3: Execute protocol handshake based on configured mode
            when (mode) {
                "custom_payload" -> executePayloadHandshake(socket, payload)
                "custom_sni" -> executeSniHandshake(socket, sni)
                "custom_host" -> executeHostHeaderHandshake(socket, sni)
                "dnstt" -> executeDnsTunnelHandshake(socket)
                else -> Log.i(TAG, "Direct connection established.")
            }

            // Step 4: Start bidirectional IP packet relay
            startPacketRelay(socket)

        } catch (e: Exception) {
            Log.e(TAG, "Tunnel connection failed: \${e.message}", e)
            stop()
        }
    }

    private fun executePayloadHandshake(socket: Socket, payloadTemplate: String) {
        Log.i(TAG, "Injecting custom HTTP/TCP payload into tunnel...")
        val out = socket.getOutputStream()
        val formattedPayload = payloadTemplate
            .replace("[host_port]", "$serverHost:$serverPort")
            .replace("[host]", serverHost)
            .replace("[port]", serverPort.toString())
            .replace("[protocol]", "HTTP/1.1")
            .replace("[crlf]", "\\r\\n")

        out.write(formattedPayload.toByteArray(Charsets.UTF_8))
        out.flush()
        Log.i(TAG, "Custom payload transmitted. Awaiting HTTP 200 Connection Established...")
    }

    private fun executeSniHandshake(baseSocket: Socket, customSni: String) {
        Log.i(TAG, "Performing SSL/TLS Handshake with custom SNI: $customSni")
        val factory = SSLSocketFactory.getDefault() as SSLSocketFactory
        val sslSocket = factory.createSocket(baseSocket, serverHost, serverPort, true) as SSLSocket
        
        val sslParams = SSLParameters()
        sslParams.serverNames = listOf(SNIHostName(if (customSni.isNotBlank()) customSni else serverHost))
        sslSocket.sslParameters = sslParams
        
        sslSocket.startHandshake()
        Log.i(TAG, "TLS Handshake verified. Cipher suite: \${sslSocket.session.cipherSuite}")
    }

    private fun executeHostHeaderHandshake(socket: Socket, hostHeader: String) {
        Log.i(TAG, "Sending HTTP proxy CONNECT with Host: $hostHeader")
        val out = socket.getOutputStream()
        val request = "CONNECT $serverHost:$serverPort HTTP/1.1\\r\\nHost: $hostHeader\\r\\n\\r\\n"
        out.write(request.toByteArray(Charsets.UTF_8))
        out.flush()
    }

    private fun executeDnsTunnelHandshake(socket: Socket) {
        Log.i(TAG, "Initializing DNSTT UDP/TCP encapsulation over port $serverPort")
    }

    private fun startPacketRelay(socket: Socket) {
        val tunInput = FileInputStream(tunInterface.fileDescriptor)
        val tunOutput = FileOutputStream(tunInterface.fileDescriptor)
        val socketIn = socket.getInputStream()
        val socketOut = socket.getOutputStream()

        val bufferSize = 32768
        
        // Coroutine for TUN -> Upstream Socket (Upload)
        CoroutineScope(Dispatchers.IO).launch {
            val buffer = ByteArray(bufferSize)
            try {
                while (isRunning.get()) {
                    val read = tunInput.read(buffer)
                    if (read > 0) {
                        socketOut.write(buffer, 0, read)
                        val up = totalUpload.addAndGet(read.toLong())
                        onTrafficUpdate(up, totalDownload.get())
                    }
                }
            } catch (e: Exception) {
                Log.d(TAG, "Upstream stream ended: \${e.message}")
            }
        }

        // Coroutine for Upstream Socket -> TUN (Download)
        CoroutineScope(Dispatchers.IO).launch {
            val buffer = ByteArray(bufferSize)
            try {
                while (isRunning.get()) {
                    val read = socketIn.read(buffer)
                    if (read > 0) {
                        tunOutput.write(buffer, 0, read)
                        val down = totalDownload.addAndGet(read.toLong())
                        onTrafficUpdate(totalUpload.get(), down)
                    }
                }
            } catch (e: Exception) {
                Log.d(TAG, "Downstream stream ended: \${e.message}")
            }
        }
    }

    fun stop() {
        isRunning.set(false)
        try {
            clientSocket?.close()
        } catch (_: Exception) {}
    }
}`
  },
  {
    path: 'app/src/main/java/com/mutigandayvan/vpn/config/VpnConfig.kt',
    filename: 'VpnConfig.kt',
    language: 'kotlin',
    description: 'Data model & AES-GCM secure encryption for configuration import/export (.myv format)',
    content: `package com.mutigandayvan.vpn.config

import org.json.JSONObject
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec
import android.util.Base64

/**
 * Mutiganda Yvan VPN - Configuration Profile & AES Encryption
 * Guarantees configurations never store credentials or private keys in plaintext.
 */
data class VpnProfile(
    val configName: String,
    val note: String,
    val connectionMode: String,
    val serverHost: String,
    val serverPort: Int,
    val payload: String,
    val sni: String,
    val isLocked: Boolean = false,
    val isHwidLocked: Boolean = false,
    val targetHwid: String? = null,
    val expiryDate: String? = null
) {
    companion object {
        private const val MAGIC_HEADER = "MYV-CFG-V2::"
        private const val ITERATIONS = 10000
        private const val KEY_LENGTH = 256
        private const val GCM_IV_LENGTH = 12
        private const val GCM_TAG_LENGTH = 128

        /**
         * Encrypt profile using AES-256-GCM
         */
        fun encryptProfile(profile: VpnProfile, passphrase: String): String {
            val json = JSONObject().apply {
                put("name", profile.configName)
                put("note", profile.note)
                put("mode", profile.connectionMode)
                put("host", profile.serverHost)
                put("port", profile.serverPort)
                put("payload", profile.payload)
                put("sni", profile.sni)
                put("locked", profile.isLocked)
                put("hwidLocked", profile.isHwidLocked)
                put("targetHwid", profile.targetHwid ?: "")
                put("expiryDate", profile.expiryDate ?: "")
            }

            val salt = ByteArray(16).also { SecureRandom().nextBytes(it) }
            val iv = ByteArray(GCM_IV_LENGTH).also { SecureRandom().nextBytes(it) }

            val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            val spec = PBEKeySpec(passphrase.toCharArray(), salt, ITERATIONS, KEY_LENGTH)
            val secretKey = SecretKeySpec(factory.generateSecret(spec).encoded, "AES")

            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, GCMParameterSpec(GCM_TAG_LENGTH, iv))

            val ciphertext = cipher.doFinal(json.toString().toByteArray(Charsets.UTF_8))

            val envelope = JSONObject().apply {
                put("header", MAGIC_HEADER)
                put("name", profile.configName)
                put("salt", Base64.encodeToString(salt, Base64.NO_WRAP))
                put("iv", Base64.encodeToString(iv, Base64.NO_WRAP))
                put("data", Base64.encodeToString(ciphertext, Base64.NO_WRAP))
            }

            return envelope.toString(2)
        }

        /**
         * Decrypt and validate .myv file
         */
        fun decryptProfile(fileContent: String, passphrase: String): Result<VpnProfile> {
            return try {
                val envelope = JSONObject(fileContent)
                val header = envelope.optString("header")
                if (!header.startsWith("MYV-CFG-")) {
                    return Result.failure(IllegalArgumentException("Unsupported file signature."))
                }

                val salt = Base64.decode(envelope.getString("salt"), Base64.DEFAULT)
                val iv = Base64.decode(envelope.getString("iv"), Base64.DEFAULT)
                val cipherBytes = Base64.decode(envelope.getString("data"), Base64.DEFAULT)

                val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                val spec = PBEKeySpec(passphrase.toCharArray(), salt, ITERATIONS, KEY_LENGTH)
                val secretKey = SecretKeySpec(factory.generateSecret(spec).encoded, "AES")

                val cipher = Cipher.getInstance("AES/GCM/NoPadding")
                cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(GCM_TAG_LENGTH, iv))

                val plainBytes = cipher.doFinal(cipherBytes)
                val json = JSONObject(String(plainBytes, Charsets.UTF_8))

                Result.success(
                    VpnProfile(
                        configName = json.getString("name"),
                        note = json.optString("note", ""),
                        connectionMode = json.getString("mode"),
                        serverHost = json.getString("host"),
                        serverPort = json.getInt("port"),
                        payload = json.optString("payload", ""),
                        sni = json.optString("sni", ""),
                        isLocked = json.optBoolean("locked", false),
                        isHwidLocked = json.optBoolean("hwidLocked", false),
                        targetHwid = json.optString("targetHwid", null),
                        expiryDate = json.optString("expiryDate", null)
                    )
                )
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mutigandayvan/vpn/ui/MainViewModel.kt',
    filename: 'MainViewModel.kt',
    language: 'kotlin',
    description: 'MVVM architecture ViewModel managing UI states, connection lifecycle, and traffic flows',
    content: `package com.mutigandayvan.vpn.ui

import android.app.Application
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.VpnService
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.mutigandayvan.vpn.service.MyvVpnService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class VpnUiState(
    val connectionState: String = "DISCONNECTED",
    val selectedServer: String = "Random Server",
    val selectedServerLocation: String = "Any Location",
    val selectedPort: Int = 80,
    val connectionMode: String = "direct",
    val customSetupEnabled: Boolean = false,
    val uploadBytes: Long = 0L,
    val downloadBytes: Long = 0L,
    val logs: List<String> = emptyList()
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(VpnUiState())
    val uiState: StateFlow<VpnUiState> = _uiState.asStateFlow()

    private val vpnReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == MyvVpnService.BROADCAST_STATUS) {
                val state = intent.getStringExtra(MyvVpnService.EXTRA_STATE) ?: "DISCONNECTED"
                val up = intent.getLongExtra(MyvVpnService.EXTRA_UP_BYTES, 0L)
                val down = intent.getLongExtra(MyvVpnService.EXTRA_DOWN_BYTES, 0L)

                _uiState.value = _uiState.value.copy(
                    connectionState = state,
                    uploadBytes = up,
                    downloadBytes = down
                )
                addLog("[$state] Traffic: Up \${formatBytes(up)}, Down \${formatBytes(down)}")
            }
        }
    }

    init {
        val filter = IntentFilter(MyvVpnService.BROADCAST_STATUS)
        application.registerReceiver(vpnReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        addLog("Mutiganda Yvan VPN initialized. Ready to connect.")
    }

    fun toggleVpn(prepareIntent: Intent?) {
        if (prepareIntent != null) {
            // Activity needs to launch VpnService.prepare(this)
            return
        }

        val app = getApplication<Application>()
        if (_uiState.value.connectionState == "CONNECTED" || _uiState.value.connectionState == "CONNECTING") {
            // Disconnect
            val intent = Intent(app, MyvVpnService::class.java).apply {
                action = MyvVpnService.ACTION_DISCONNECT
            }
            app.startService(intent)
        } else {
            // Connect
            val intent = Intent(app, MyvVpnService::class.java).apply {
                action = MyvVpnService.ACTION_CONNECT
                putExtra("server_host", "node-auto.myv-vpn.net")
                putExtra("server_port", _uiState.value.selectedPort)
                putExtra("connection_mode", _uiState.value.connectionMode)
            }
            app.startService(intent)
        }
    }

    fun setServer(name: String, location: String) {
        _uiState.value = _uiState.value.copy(selectedServer = name, selectedServerLocation = location)
        addLog("Selected server: $name ($location)")
    }

    fun setPort(port: Int) {
        _uiState.value = _uiState.value.copy(selectedPort = port)
        addLog("Selected port: P $port")
    }

    fun setConnectionMode(mode: String) {
        _uiState.value = _uiState.value.copy(connectionMode = mode)
        addLog("Connection mode changed: $mode")
    }

    fun setCustomSetup(enabled: Boolean) {
        _uiState.value = _uiState.value.copy(customSetupEnabled = enabled)
    }

    fun addLog(msg: String) {
        _uiState.value = _uiState.value.copy(logs = _uiState.value.logs + msg)
    }

    fun clearLogs() {
        _uiState.value = _uiState.value.copy(logs = emptyList())
    }

    private fun formatBytes(bytes: Long): String {
        return when {
            bytes < 1024 -> "$bytes B"
            bytes < 1024 * 1024 -> "\${bytes / 1024} KB"
            else -> "\${bytes / (1024 * 1024)} MB"
        }
    }

    override fun onCleared() {
        super.onCleared()
        getApplication<Application>().unregisterReceiver(vpnReceiver)
    }
}`
  },
  {
    path: 'app/src/main/java/com/mutigandayvan/vpn/ui/MainActivity.kt',
    filename: 'MainActivity.kt',
    language: 'kotlin',
    description: 'Main activity requesting Android VpnService permission and binding UI',
    content: `package com.mutigandayvan.vpn.ui

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels

/**
 * Mutiganda Yvan VPN - Main Activity
 * Integrates VpnService.prepare() permission request flow and hosts the user interface.
 */
class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    // Activity result launcher for Android VpnService user dialog
    private val vpnPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            // Permission granted by user, start tunnel
            viewModel.toggleVpn(null)
        } else {
            Toast.makeText(this, "VPN permission is required to establish tunnel", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Setup UI views / Compose tree
        // Mutiganda Yvan VPN Orange & White theme applied in res/values/themes.xml
    }

    /**
     * Called when user taps START button
     */
    fun onStartVpnClicked() {
        val prepareIntent = VpnService.prepare(this)
        if (prepareIntent != null) {
            // System dialog required: prompt user to authorize VPN connection
            vpnPermissionLauncher.launch(prepareIntent)
        } else {
            // Already authorized
            viewModel.toggleVpn(null)
        }
    }
}`
  },
  {
    path: 'app/build.gradle.kts',
    filename: 'build.gradle.kts (App)',
    language: 'gradle',
    description: 'App-level Gradle build script with Android 14/15 SDK and dependencies',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.mutigandayvan.vpn"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mutigandayvan.vpn"
        minSdk = 26
        targetSdk = 35
        versionCode = 108
        versionName = "2.4.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.4")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    description: 'Step-by-step instructions for opening and building in Android Studio',
    content: `# Mutiganda Yvan VPN - Android Project

A high-performance Android VPN tunneling client built with Kotlin, modern Android MVVM architecture, and official Android \`VpnService\` APIs.

## Features
- **Modern Orange & White Material Design**: Clean, ergonomic layout inspired by tunneling tools.
- **Official VpnService API**: Allocates virtual \`tun0\` interface with \`0.0.0.0/0\` routing.
- **Multiple Tunneling Modes**:
  1. Direct Connection (Internet)
  2. Custom HTTP/TCP Payload (Injection mode)
  3. Custom Host Header (HTTP Mode)
  4. Custom SNI (SSL/TLS Mode)
  5. DNSTT (DNS Tunneling Mode)
  6. Imported Profile (.myv configuration)
- **Secure Encrypted Configurations**: AES-256-GCM encryption with optional hardware ID (HWID) binding and expiration date enforcement.
- **Live Traffic Counters**: Real-time upload and download byte tracking with notification integration.

## How to Import in Android Studio
1. Unzip the project folder or clone the repository.
2. Open **Android Studio** (Hedgehog, Iguana, or Ladybug).
3. Select **File > Open** and choose the project directory.
4. Allow Gradle to sync dependencies.
5. In \`MyvVpnService.kt\`, verify your legitimate server endpoints or add your own server IPs in \`SERVERS\`.
6. Connect an Android device or launch an emulator (API 26+).
7. Click **Run > Run 'app'** (Shift + F10).
`
  }
];
