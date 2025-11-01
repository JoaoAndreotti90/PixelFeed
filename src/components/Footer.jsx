import "./Footer.css";
import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>PixelFeed</h3>
        </div>

        <p className="footer-description">
          Compartilhe seus melhores momentos e conecte-se com pessoas incríveis
        </p>

        <div className="footer-social">
          <a
            href="https://github.com/JoaoAndreotti90"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <BsGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/jo%C3%A3o-andreotti/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <BsLinkedin />
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} PixelFeed • Feito por João Andreotti
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;