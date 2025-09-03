import { signInWithGoogle } from "@/services/api/supabase/auth";
/**
 * 인증 관련 비즈니스 로직을 담당하는 서비스
 */
export class AuthService {
    static async signInWithGoogle() {
        return await signInWithGoogle();
    }
  
}
