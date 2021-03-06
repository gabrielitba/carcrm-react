import { HTTP } from '../../config/http';
import { showLoading } from '../actions/loading';
import { showNotify } from '../actions/notify';

export const actionsTypes = {
  EDIT: 'AUTH_EDIT',
  SUCCESS: 'AUTH_SUCCESS',
};

export const editAuth = (payload) => ({
  type: actionsTypes.EDIT,
  payload,
});

export const successAuth = (payload) => ({
  type: actionsTypes.SUCCESS,
  payload,
});

export const setUserToken = (token) => (dispatch) => {
  localStorage.setItem('@CARCRM:Token', token);

  dispatch(
    editAuth({
      email: '',
      password: '',
    })
  );

  dispatch(successAuth(true));
};

export const login = (credentials) => (dispatch) => {
  dispatch(
    showLoading({
      open: true,
      msg: 'Autenticando usuário...',
    })
  );

  return HTTP.post('oauth/token', {
    grant_type: 'password',
    client_id: 2,
    client_secret: '1tD8CuxRxMAUGZHkDfOAj0OBeP0XzURNE0HvMAbJ',
    username: credentials.email,
    password: credentials.password,
  })
    .then((response) => {
      dispatch(showLoading({ open: false }));

      if (typeof response !== 'undefined') {
        if (response.data.access_token) {
          dispatch(setUserToken(response.data.access_token));
        }
      }
    })
    .catch((error) => {
      dispatch(showLoading({ open: false }));

      if (typeof error.response !== 'undefined') {
        if (error.response.status === 401 || error.response.status === 404) {
          dispatch(
            showNotify({
              open: true,
              class: 'error',
              msg: 'Verifique suas credênciais',
            })
          );
        } else {
          dispatch(
            showNotify({
              open: true,
              class: 'error',
              msg: 'Erro inesperádo! Por favor, contate o administrador.',
            })
          );
        }
      }
    });
};
