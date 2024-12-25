using Blazor.DevTools.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace Blazor.DevTools.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddDevTools(this WebAssemblyHostBuilder builder)
        => builder.RootComponents.RegisterForJavaScript<DevToolsHost>("devTools", "loadDevTools");
    
}