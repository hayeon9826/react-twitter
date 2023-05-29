import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast("회원가입에 성공했습니다");
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
      } else if (value !== passwordConfirmation) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }
    if (name === "password_confirmation") {
      setPasswordConfirmation(value);

      if (value?.length < 8) {
        setError("비밀번호 확인은 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="Form Form--lg">
      <h1 className="Form__title">회원가입</h1>
      <div className="Form__block">
        <label htmlFor="email">이메일</label>
        <input type="text" name="email" id="email" required value={email} onChange={onChange} />
      </div>
      <div className="Form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" required value={password} onChange={onChange} />
      </div>
      <div className="Form__block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input type="password" name="password_confirmation" id="password_confirmation" required value={passwordConfirmation} onChange={onChange} />
      </div>
      {error && error?.length > 0 && (
        <div className="Form__block">
          <div className="Form__error">{error}</div>
        </div>
      )}
      <div className="Form__block">
        계정이 있으신가요?
        <Link className="Form__link" to="/login">
          로그인하기
        </Link>
      </div>
      <div className="Form__block--lg">
        <input type="submit" value="회원가입" className="Form__btn-submit" disabled={error?.length > 0} />
      </div>
    </form>
  );
}
