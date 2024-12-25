const devToolParameters = {
    id: "_blazorDevTools"    
}

window.loadDevTools = function(component, parameters) {
    devToolParameters.component = component;
    devToolParameters.parameters = parameters;
}

function getAllComments(node) {
    const xPath = "//comment()",
        result = [];

    let query = document.evaluate(xPath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) 
        result.push(query.snapshotItem(i));
    
    return result;
}

(function initializeDevTools() {
    setTimeout(() => {
        if (Blazor._internal.dotNetExports) {
            Blazor._internal.dotNetExports.InvokeDotNet("Blazor.DevTools", "initializeDevTools");

            const elem = document.createElement('div');
            elem.id = devToolParameters.id;
            document.getElementById('app').appendChild(elem);

            let containerElement = document.querySelector(`#${devToolParameters.id}`)
            window.Blazor.rootComponents.add(containerElement, devToolParameters.component, {});
        }
    }, 1000)
})()

//console.log(getAllComments(document.documentElement))
