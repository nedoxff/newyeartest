interface Array<T> {
	reverseIf(reverse: boolean): Array<T>;
}
Array.prototype.reverseIf = function (reverse: boolean): Array<any> {
	if (reverse) return this.toReversed();
	return this;
};
