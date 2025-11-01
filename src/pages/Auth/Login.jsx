import "./Auth.css";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import { BsCamera } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    dispatch(login(user));
  };

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
      <div className="auth-container">
        <div className="auth-brand">
          <BsCamera className="brand-icon" />
          <h2>PixelFeed</h2>
        </div>

        <p className="subtitle">
          Faça login para ver o que há de novo e conectar-se com seus amigos
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              placeholder="Digite sua senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {!loading && <input type="submit" value="Entrar" />}
          {loading && (
            <input
              type="submit"
              disabled
              value="Entrando..."
              className="auth-loading"
            />
          )}

          {error && <Message msg={error} type="error" />}
        </form>

        <p>
          Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;