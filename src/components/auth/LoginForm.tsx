import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast("로그인에 성공했습니다");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: any) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else {
        setError("");
      }
    }
  };

  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name, value },
    } = e;
    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    const data = signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(credential, token, user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="Form Form--lg">
        <h1 className="Form__title">로그인</h1>
        <div className="Form__block">
          <label htmlFor="email">이메일</label>
          <input type="text" name="email" id="email" required value={email} onChange={onChange} />
        </div>
        <div className="Form__block">
          <label htmlFor="password">비밀번호</label>
          <input type="password" name="password" id="password" required value={password} onChange={onChange} />
        </div>
        {error && error?.length > 0 && (
          <div className="Form__block">
            <div className="Form__error">{error}</div>
          </div>
        )}
        <div className="Form__block">
          계정이 없으신가요?
          <Link className="Form__link" to="/signup">
            회원가입하기
          </Link>
        </div>
        <div className="Form__block--lg">
          <input type="submit" value="로그인" className="Form__btn-submit" disabled={error?.length > 0} />
        </div>
      </form>
      <div>
        <button type="button" name="google" onClick={onClickSocialLogin}>
          Google로 로그인
        </button>
      </div>
      <div>
        <button type="button" name="github" onClick={onClickSocialLogin}>
          Github로 로그인
        </button>
      </div>
    </>
  );
}
