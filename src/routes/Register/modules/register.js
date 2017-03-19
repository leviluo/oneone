import axios from 'axios'


export function fetchRegister (items) {
    return axios.post('/register',items)
}
