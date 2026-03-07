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

    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = if (isLogin) "Login to Buspay" else "Create Account",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        TextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Username") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (!isLogin) {
            TextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        TextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                scope.launch {
                    try {
                        if (isLogin) {
                            val response = RetrofitClient.instance.loginUser(LoginRequest(username, password))
                            if (response.isSuccessful) {
                                val user = response.body()
                                Toast.makeText(context, "Welcome back, ${user?.username}!", Toast.LENGTH_SHORT).show()
                                onLoginSuccess(user?.username ?: "")
                            } else {
                                Toast.makeText(context, "Login failed: ${response.errorBody()?.string()}", Toast.LENGTH_LONG).show()
                            }
                        } else {
                            val response = RetrofitClient.instance.registerUser(mapOf("username" to username, "email" to email, "password" to password))
                            if (response.isSuccessful) {
                                Toast.makeText(context, "Registered! Please login.", Toast.LENGTH_LONG).show()
                                isLogin = true
                            } else {
                                Toast.makeText(context, "Registration failed: ${response.errorBody()?.string()}", Toast.LENGTH_LONG).show()
                            }
                        }
                    } catch (e: Exception) {
                        Toast.makeText(context, "An error occurred: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(if (isLogin) "Sign In" else "Sign Up")
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
        Text(text = "Dashboard", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "Welcome, $username!", style = MaterialTheme.typography.bodyLarge)

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = onLogout,
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
        ) {
            Text("Logout")
        }
    }
}
