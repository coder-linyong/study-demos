/**
 * 发布订阅工厂函数，发布订阅模式的通用实现
 * @returns {{subscribe: (eventName: T, fn: Function) => void, unsubscribe: (eventName: T, fn?: Function) => void, publish: (eventName: T, ...args) => void}}
 */
export default function pubSubFactory<T>() {
	// @ts-ignore
	type MessageMap = { [key in `${T}`]: Array<Function> }
	const messageMap = <MessageMap>{};

	function subscribe(eventName: T, fn: Function) {
		// @ts-ignore
		(messageMap[eventName] || (messageMap[eventName] = [])).push(fn);
	}

	function publish(eventName: T, ...args) {
		// @ts-ignore
		(messageMap[eventName] || []).forEach(fn => fn.apply(this, args));
	}

	/**
	 * 取消订阅
	 * @param {T} eventName 事件名
	 * @param {Function} fn 订阅函数，如果没有传入，则代表取消该事件全部订阅
	 */
	function unsubscribe(eventName: T, fn?: Function) {
		if (!fn) {
			// @ts-ignore
			messageMap[eventName] = [];
			return;
		}
		// @ts-ignore
		const fns = messageMap[eventName] || [];
		const index = fns.findIndex(f => f === fn);
		index !== -1 && fns.splice(index, 1);
	}

	return {
		subscribe,
		publish,
		unsubscribe
	};
};
