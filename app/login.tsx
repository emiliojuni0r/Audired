import { View, Button, Alert, StyleSheet, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { auth } from "@/firebase";
import { saveItem } from '../context/SecureStorage';


WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "401028140081-eu0g6ljpdq56gjup22dbgk04qh5mcrh5.apps.googleusercontent.com",
    iosClientId: "", // Add your iOS client ID here if needed
    clientId: "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com",
    webClientId: "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com", 
    scopes : ["openid","email","profile"]
  });

  useEffect(() => {
    const authenticate = async () => {
      if (response?.type === "success") {
        setIsLoading(true);
        const { id_token, access_token } = response.params;
        
        try {
          const credential = GoogleAuthProvider.credential(id_token, access_token);
          const firebaseUserCredential = await signInWithCredential(auth, credential);
          
          const firebaseIdToken = await firebaseUserCredential.user.getIdToken();
          
          // Send token to backend
          const res = await axios.post("https://audired-820e0.et.r.appspot.com/api/auth/google-login", {
            idToken: firebaseIdToken,
          });
          
          // Your backend returns a JWT or session token
          const backendToken = res.data.token;``
          await saveItem("token", String(res.data.token));
          login(backendToken);
        } catch (err) {
          console.error("Login failed", err);
          Alert.alert("Login failed", "An unknown error occurred.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    authenticate();
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error("Failed to start Google auth flow:", error);
      Alert.alert("Authentication Error", "Could not start the authentication process.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <Button
        title={isLoading ? "Signing in..." : "Sign in with Google"}
        onPress={handleGoogleSignIn}
        disabled={!request || isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  }
});