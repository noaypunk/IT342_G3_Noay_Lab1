package com.example.buspay

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.example.buspay.models.LoginRequest
import com.example.buspay.network.RetrofitClient
import com.example.buspay.ui.theme.BuspayTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BuspayTheme {
                // Keep track of the logged-in username
                var loggedInUser by remember { mutableStateOf<String?>(null) }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (loggedInUser == null) {
                        AuthScreen(onLoginSuccess = { username ->
                            loggedInUser = username
                        })
                    } else {
                        // Pass the username to match your "Welcome back, nayr!" design
                        DashboardScreen(
                            username = loggedInUser!!,
                            onLogout = { loggedInUser = null }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AuthScreen(onLoginSuccess: (String) -> Unit) {
    var isLogin by remember { mutableStateOf(true) }
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    // Loading state to disable button during network call
    var isLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = if (isLogin) "Login to BusPay" else "Create Account",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Username") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        if (!isLogin) {
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (username.isBlank() || password.isBlank()) {
                    Toast.makeText(context, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                scope.launch {
                    isLoading = true
                    try {
                        if (isLogin) {
                            val response = RetrofitClient.instance.loginUser(LoginRequest(username, password))
                            if (response.isSuccessful) {
                                val user = response.body()
                                onLoginSuccess(user?.username ?: username)
                            } else {
                                val errorMsg = response.errorBody()?.string() ?: "Unknown error"
                                Toast.makeText(context, "Login failed: $errorMsg", Toast.LENGTH_LONG).show()
                            }
                        } else {
                            val regData = mapOf("username" to username, "email" to email, "password" to password)
                            val response = RetrofitClient.instance.registerUser(regData)
                            if (response.isSuccessful) {
                                Toast.makeText(context, "Registered! Please login.", Toast.LENGTH_LONG).show()
                                isLogin = true
                            } else {
                                Toast.makeText(context, "Failed: ${response.code()}", Toast.LENGTH_LONG).show()
                            }
                        }
                    } catch (e: Exception) {
                        // This usually catches the 'UnknownHostException' if your Spring Boot is down
                        Toast.makeText(context, "Connection Error: Is your Backend running?", Toast.LENGTH_LONG).show()
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading // Disable button while loading
        ) {
            if (isLoading) CircularProgressIndicator(size = 20.dp)
            else Text(if (isLogin) "Sign In" else "Sign Up")
        }

        TextButton(onClick = { isLogin = !isLogin }) {
            Text(if (isLogin) "Need an account? Register" else "Have an account? Login")
        }
    }
}

@Composable
fun DashboardScreen(username: String, onLogout: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "BusPay", style = MaterialTheme.typography.headlineLarge)
        Spacer(modifier = Modifier.height(16.dp))

        // Matches your requested UI "Welcome back, [name]!"
        Text(text = "Welcome back, $username!", style = MaterialTheme.typography.headlineSmall)

        Text(
            text = "Manage your bus payments and account details here.",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(top = 8.dp)
        )

        Spacer(modifier = Modifier.height(48.dp))

        Button(
            onClick = onLogout,
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
        ) {
            Text("Logout")
        }
    }
}