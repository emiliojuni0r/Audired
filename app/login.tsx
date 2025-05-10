// import {
//   View,
//   Button,
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/auth";

// import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
// import axios from "axios";
// import { auth } from "@/firebase";
// import { saveItem } from '../context/SecureStorage';
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// WebBrowser.maybeCompleteAuthSession();

// export default function Login() {
//   const { login } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId:
//       "401028140081-eu0g6ljpdq56gjup22dbgk04qh5mcrh5.apps.googleusercontent.com",
//     iosClientId: "", // Add your iOS client ID here if needed
//     clientId:
//       "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com",
//     webClientId:
//       "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com",
//     scopes: ["openid", "email", "profile"],
//   });

//   useEffect(() => {
//     const authenticate = async () => {
//       if (response?.type === "success") {
//         setIsLoading(true);
//         const { id_token, access_token } = response.params;

//         try {
//           const credential = GoogleAuthProvider.credential(
//             id_token,
//             access_token
//           );
//           const firebaseUserCredential = await signInWithCredential(
//             auth,
//             credential
//           );

//           const firebaseIdToken =
//             await firebaseUserCredential.user.getIdToken();

//           // Send token to backend
//           const res = await axios.post(
//             "https://audired-820e0.et.r.appspot.com/api/auth/google-login",
//             {
//               idToken: firebaseIdToken,
//             }
//           );

//           // Your backend returns a JWT or session token
//           const backendToken = res.data.token;
//           ``;
//           await saveItem("token", String(res.data.token));
//           login(backendToken);
//         } catch (err) {
//           console.error("Login failed", err);
//           Alert.alert("Login failed", "An unknown error occurred.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     authenticate();
//   }, [response]);

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsLoading(true);
//       await promptAsync();
//     } catch (error) {
//       console.error("Failed to start Google auth flow:", error);
//       Alert.alert(
//         "Authentication Error",
//         "Could not start the authentication process."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white justify-center items-center p-[20px]">
//       <Text className="text-2xl font-bold mb-0.5">Selamat Datang</Text>
//       <Image source={require("../assets/images/icon.png")} width={10} height={10}></Image>

//       <TouchableOpacity className="w-[83%] h-10 mx-auto border border-[#150E7C] justify-center items-center flex-row rounded-[8px]"
//         onPress={handleGoogleSignIn}
//         disabled={!request || isLoading}
//       >
//         {isLoading ? (<View></View>) : <Ionicons name="logo-google" size={20} className="mr-2"/>}
//         <Text>{isLoading ? "Memuat..." : "Lanjutkan dengan Google"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


import {
  View,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { auth } from "@/firebase";
import { saveItem } from '../context/SecureStorage';
import { Ionicons } from "@expo/vector-icons";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // For web platform
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "401028140081-eu0g6ljpdq56gjup22dbgk04qh5mcrh5.apps.googleusercontent.com",
    iosClientId: "", // Add your iOS client ID here if needed
    webClientId: "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com",
    scopes: ["openid", "email", "profile"],
  });

  // Configure Google Sign-In for mobile
  useEffect(() => {
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: "401028140081-q8hg2tt64ht9jkc14s2vmenea08e3rtk.apps.googleusercontent.com",
        offlineAccess: true,
      });
    }
  }, []);

  // Handle web authentication response
  useEffect(() => {
    if (Platform.OS === 'web' && response?.type === 'success') {
      handleAuthSuccess(response.params.id_token, response.params.access_token);
    }
  }, [response]);

  const handleAuthSuccess = async (idToken: string, accessToken?: string) => {
    try {
      setIsLoading(true);
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const firebaseUserCredential = await signInWithCredential(auth, credential);
      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

      const res = await axios.post(
        "https://audired-820e0.et.r.appspot.com/api/auth/google-login",
        { idToken: firebaseIdToken }
      );

      await saveItem("token", String(res.data.token));
      login(res.data.token);
    } catch (err) {
      console.error("Login failed", err);
      Alert.alert("Login failed", "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      if (Platform.OS === 'web') {
        await promptAsync();
      } else {
        // Mobile implementation
        await GoogleSignin.hasPlayServices();
        
        // First sign in to get user info
        await GoogleSignin.signIn();
        
        // Then get the ID token separately
        const { idToken } = await GoogleSignin.getTokens();
        
        if (!idToken) {
          throw new Error('No ID token received');
        }
        
        await handleAuthSuccess(idToken);
      }
    } catch (error) {
      console.error("Failed to start Google auth flow:", error);
      
      if (Platform.OS !== 'web') {
        if (error === statusCodes.SIGN_IN_CANCELLED) {
          // User cancelled the login flow
          return;
        } else if (error === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert("Play Services Not Available", "Google Play services not available or outdated");
          return;
        }
      }
      
      Alert.alert("Authentication Error", "Could not start the authentication process.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white justify-center items-center p-[20px]">
      <Text className="text-2xl font-bold mb-0.5">Selamat Datang</Text>
      <Image source={require("../assets/images/icon.png")} width={10} height={10}></Image>

      <TouchableOpacity 
        className="w-[83%] h-10 mx-auto border border-[#150E7C] justify-center items-center flex-row rounded-[8px]"
        onPress={handleGoogleSignIn}
        disabled={isLoading || (Platform.OS === 'web' && !request)}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#150E7C" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} className="mr-2"/>
            <Text>Lanjutkan dengan Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}