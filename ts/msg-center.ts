export enum GuideMessage {
	startBooting,
}

type MessageMap = { [key in `${GuideMessage}`]: Array<Function> }
const messageMap = <MessageMap>{};

export function subscribe(eventName: GuideMessage, fn: Function) {
	(messageMap[eventName] || (messageMap[eventName] = [])).push(fn);
}

export function publish(eventName: GuideMessage, ...args) {
	(messageMap[eventName] || []).forEach(fn => fn.apply(this, args));
}

/**
 * 取消订阅
 * @param {GuideMessage} eventName 事件名
 * @param {Function} fn 订阅函数，如果没有传入，则代表取消该事件全部订阅
 */
export function unsubscribe(eventName: GuideMessage, fn?: Function) {
	if (!fn) {
		messageMap[eventName] = [];
		return;
	}
	const fns = messageMap[eventName] || [];
	const index = fns.findIndex(f => f === fn);
	index !== -1 && fns.splice(index, 1);
}
