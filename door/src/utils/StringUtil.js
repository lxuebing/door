export function buildParamsString(params) {
    let {color, openway, width, height} = params
    if(color && openway && width && height) {
        return color + '/' + openway + '/' + width + 'x' + height
    } else {
        return ""
    }
}