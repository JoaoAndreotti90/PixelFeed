import "./Home.css";
import PhotoItem from "../../components/PhotoItem";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading, error } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  const handleLike = (photoId) => {
    dispatch(like(photoId));
    resetMessage();
  };

  if (loading) {
    return (
      <div id="home">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando fotos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="home">
        <div className="no-photos">
          <h2>❌ Erro ao carregar fotos</h2>
          <p>{error}</p>
          <button
            onClick={() => dispatch(getPhotos())}
            className="btn-retry"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="home">
      {photos && photos.length > 0 && (
        <div className="welcome-message">
          <h2>Bem-vindo ao PixelFeed! 👋</h2>
          <p>Confira os melhores momentos compartilhados pela comunidade</p>
        </div>
      )}

      {photos && photos.length > 0 ? (
        <div className="photos-container">
          {photos.map((photo) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              user={user}
              handleLike={() => handleLike(photo.id)}
            />
          ))}
        </div>
      ) : (
        <div className="no-photos">
          <h2>📸 Nenhuma foto por aqui ainda</h2>
          <p>
            {user && user.user ? (
              <>
                Seja o primeiro a compartilhar um momento!{" "}
                <Link to={`/users/${user.user.id}`}>Clique aqui</Link> para
                começar.
              </>
            ) : (
              "Faça login para ver e compartilhar fotos."
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;