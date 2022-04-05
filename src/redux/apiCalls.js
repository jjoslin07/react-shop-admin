import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../redux/requestMethods";
import {
	addProductFailure,
	addProductStart,
	addProductSuccess,
	deleteProductFailure,
	deleteProductStart,
	deleteProductSuccess,
	getProductFailure,
	getProductStart,
	getProductSuccess,
	updateProductFailure,
	updateProductStart,
	updateProductSuccess,
} from "./productRedux";

export const login = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await publicRequest.post("/auth/login", user);
		dispatch(loginSuccess(res.data));
	} catch (error) {
		dispatch(loginFailure());
	}
};
export const getProducts = async (dispatch) => {
	dispatch(getProductStart());
	try {
		const res = await publicRequest.get("/products");
		dispatch(getProductSuccess(res.data));
	} catch (error) {
		dispatch(getProductFailure());
	}
};
export const deleteProduct = async (id, dispatch) => {
	dispatch(deleteProductStart());
	try {
		// UNCOMMENT THE LINE BELOW TO DELETE FROM DATABASE
		// const res = await userRequest.delete(`/products/${id}`);
		dispatch(deleteProductSuccess(id));
	} catch (error) {
		dispatch(deleteProductFailure());
	}
};
export const updateProduct = async (id, product, dispatch) => {
	dispatch(updateProductStart());
	try {
		const res = await userRequest.put(`/products/${id}`, product);
		dispatch(updateProductSuccess({ product: res.data }));
	} catch (error) {
		dispatch(updateProductFailure());
	}
};
export const addProduct = async (product, dispatch) => {
	dispatch(addProductStart());
	try {
		const res = await userRequest.post(`/products`, product);
		dispatch(addProductSuccess(res.data));
	} catch (error) {
		dispatch(addProductFailure());
	}
};
