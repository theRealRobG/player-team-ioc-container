// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
export default function getParamNames(fn: Function) {
    let $inject: string[] = (fn as any).$inject;
    let fnText: string;
    let argDecl: string[];

    if (!(fn as any).$inject) {
        $inject = [];
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS) as string[];
        argDecl[1].split(FN_ARG_SPLIT).forEach((arg) => {
            arg.replace(FN_ARG, (all, underscore, name) => {
                $inject.push(name);
                return name;
            });
        });
        (fn as any).$inject = $inject;
    }

    return $inject;
}
