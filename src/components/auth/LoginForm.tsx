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
      target: { name },
    } = e;
    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider)
      .then((result) => {
        //   // This gives you a Google Access Token. You can use it to access the Google API.
        //   const credential = GoogleAuthProvider.credentialFromResult(result);
        //   const token = credential?.accessToken;
        //   // The signed-in user info.
        //   const user = result.user;
        //   console.log(credential, token, user);
        toast.success("로그인 되었습니다.");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="pt-20 px-4">
        <h1 className="text-center text-xl font-bold">로그인</h1>
        <div className="mt-8">
          <label htmlFor="email" className="block font-semibold text-lg">
            이메일
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="w-full px-4 py-2 !outline-none border border-slate-100 focus:border-blue-600 rounded-md mt-2"
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="mt-8">
          <label htmlFor="password" className="block font-semibold text-lg">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2 !outline-none border border-slate-100 focus:border-blue-600 rounded-md mt-2"
            required
            value={password}
            onChange={onChange}
          />
        </div>
        {error && error?.length > 0 && (
          <div className="mt-8">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}
        <div className="mt-8">
          계정이 없으신가요?
          <Link className="ml-2 text-blue-500 hover:text-blue-600 focus:text-blue-500 underline" to="/signup">
            회원가입하기
          </Link>
        </div>
        <div className="mt-8">
          <input
            type="submit"
            value="로그인"
            className="w-full bg-blue-500 focus:bg-blue-600 hover:bg-blue-600 text-white rounded-md px-4 py-2.5 cursor-pointer"
            disabled={error?.length > 0}
          />
        </div>
      </form>
      <div className="mx-4 mt-4">
        <button
          type="button"
          name="google"
          className="w-full bg-white focus:bg-gray-100 hover:bg-gray-100 border border-slate-100 text-black rounded-md px-4 py-2.5 cursor-pointer"
          onClick={onClickSocialLogin}
        >
          Google 로그인
        </button>
      </div>
      <div className="mx-4 mt-4">
        <button
          type="button"
          name="github"
          className="w-full bg-black focus:bg-black/80 hover:bg-black/80 text-white rounded-md px-4 py-2.5 cursor-pointer"
          onClick={onClickSocialLogin}
        >
          Github 로그인
        </button>
      </div>
    </>
  );
}
