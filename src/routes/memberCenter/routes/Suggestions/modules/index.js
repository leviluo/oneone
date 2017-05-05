import axios from 'axios'

export function submitText(fd) {
    return axios.post('/suggestions',fd)
}
