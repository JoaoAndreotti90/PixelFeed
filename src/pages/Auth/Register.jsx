import "./Auth.css";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import { BsCamera } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, password, confirmPassword };
    dispatch(register(user));
  };

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <div className="auth-container">
        <div className="auth-brand">
          <BsCamera className="brand-icon" />
          <h2>PixelFeed</h2>
        </div>

        <p className="subtitle">
          Cadastre-se para compartilhar momentos e conectar-se com amigos
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="text"
              placeholder="Digite seu nome"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

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
              placeholder="Crie uma senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              placeholder="Confirme sua senha"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </div>

          {!loading && <input type="submit" value="Cadastrar" />}
          {loading && (
            <input
              type="submit"
              disabled
              value="Cadastrando..."
              className="auth-loading"
            />
          )}

          {error && <Message msg={error} type="error" />}
          </form>

        <p>
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;