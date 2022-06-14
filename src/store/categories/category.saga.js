import { takeLatest, all, call, put } from 'redux-saga/effects';

import { getCategoriesAndDocuments } from '../../utils/firebase/firebase.utils';

import { fetchCategoriesSuccess, fetchCategoriesFailed } from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';

export function* fetchCategoriesAsync() {
	try {
		const categoriesArray = yield call(getCategoriesAndDocuments, 'categories'); //anywhere you have a function and you want to make it into an effect you use the call keyword
		yield put(fetchCategoriesSuccess(categoriesArray)); //put replaces dispatch in redux-saga
	} catch (error) {
		yield put(fetchCategoriesFailed(error));
	}
}

export function* onFetchCategories() {
	yield takeLatest(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, fetchCategoriesAsync); //take is where we recieve actions, take latest just asks for the latest action recieved
}

export function* categoriesSaga() {
	yield all([call(onFetchCategories)]); // this makes the code wait until everything in this line is finished
}
