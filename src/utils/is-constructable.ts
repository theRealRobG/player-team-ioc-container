export default function isConstructable(obj: Function) {
    return !!obj.prototype && !!obj.prototype.constructor.name;
}
