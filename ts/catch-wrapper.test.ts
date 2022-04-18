import { catchWrapper } from '@src/renderer/utils/userActionCollection/actionCollector'

describe('测试catchWrapper', function () {
	it('应该返回正确的内容', function () {
		const hander = jest.fn()
		const fun = catchWrapper((a: number, b: number) => {
			return a + b
		}, hander)
		expect(fun(1, 2)).toBe(3)
	});
	it('应该正常捕获错误', function () {
		const hander = jest.fn()
		const fun = catchWrapper(() => {
			throw Error('has error')
		}, hander)
		fun()
		expect(fun).not.toThrowError()
		expect(hander).toBeCalled()
	});
});