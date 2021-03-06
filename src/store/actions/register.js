import { HTTP } from '../../config/http';
import { showLoading } from './loading';
import { showNotify } from './notify';

export const actionTypes = {
  EDIT: 'REGISTER_EDIT',
  ERROR: 'REGISTER_ERROR',
  SUCCESS: 'REGISTER_SUCCESS',
};

export const editRegister = (payload) => ({
  type: actionTypes.EDIT,
  payload,
});

export const errorRegister = (payload) => ({
  type: actionTypes.ERROR,
  payload,
});

export const successRegister = (payload) => ({
  type: actionTypes.SUCCESS,
  payload,
});

export const setUserToken = (token) => (dispatch) => {
  localStorage.setItem('@CARCRM:Token', token);

  dispatch(
    editRegister({
      name: '',
      email: '',
      password: '',
    })
  );

  dispatch(successRegister(true));
};

export const register = (data) => (dispatch) => {
  dispatch(
    showLoading({
      open: true,
      msg: 'Cadastrando usuário...',
    })
  );

  return HTTP.post('register', data)
    .then((response) => {
      dispatch(
        showLoading({
          open: false,
        })
      );

      if (typeof register !== 'undefined') {
        if (response.data.access_token) {
          dispatch(
            showNotify({
              open: true,
              class: 'success',
              msg: 'Usuário cadastrado com sucesso',
            })
          );

          dispatch(setUserToken(response.data.access_token));
        }
      }
    })
    .catch((error) => {
      dispatch(
        showLoading({
          open: false,
        })
      );
      if (error.response) {
        dispatch(errorRegister(error.response.data.errors));
      }
    });
};
