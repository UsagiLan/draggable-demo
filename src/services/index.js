import { stringify } from 'qs';
import request from '../utils/request';

export function delUser(params) {
	return request(`/api/deluser/${params}`)
}

//获取用户数据
export function fetchUserData(params) {
	return request(`/api/user?${stringify(params)}`);
}
//列表页接口
export function fetchListData(params) {
  return request(`/api/list?${stringify(params)}`);
}

export function loginAccount(params) {
	return request('/api/login', {
		method: 'POST',
		body: {
			...params
		}
	});
}