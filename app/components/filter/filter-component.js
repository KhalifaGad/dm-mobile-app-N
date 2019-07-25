import { filterStatus } from '~/app'

function close(){
	filterStatus.opened = false
}

export { close, filterStatus}