import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { createOrUpdateUser } from "@services/firestore";
import type { UserProfile } from "@utils/types";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    scopes: ["profile", "email"]
  });

  useEffect(() => {
    async function handleResponse() {
      if (response?.type === "success" && response.authentication) {
        const credential = GoogleAuthProvider.credential(response.authentication.idToken);
        const auth = getFirebaseAuth();
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        const profile: UserProfile = {
          id: user.uid,
          name: user.displayName ?? "Developer",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          createdAt: Date.now()
        };
        await createOrUpdateUser(profile);
      }
    }
    handleResponse();
  }, [response]);

  return { request, promptAsync };
}
