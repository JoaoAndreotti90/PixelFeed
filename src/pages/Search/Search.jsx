import "./Search.css";
import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import PhotoItem from "../../components/PhotoItem";
import { searchPhotos, like } from "../../slices/photoSlice";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  const handleLike = (photoId) => {
    dispatch(like(photoId));
    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="search">
      <h2>Você está buscando por: {search}</h2>
      {photos && photos.length > 0 ? (
        photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            user={user}
            handleLike={() => handleLike(photo.id)}
          />
        ))
      ) : (
        <p>Nenhuma foto encontrada.</p>
      )}
    </div>
  );
};

export default Search;