using System.Reflection;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazor.DevTools.Components.Content;

public partial class Components(IJSRuntime jsRuntime) : ComponentBase
{
    private Assembly? _me = Assembly.GetEntryAssembly();
    private Type[] _types = [];

    protected override async Task OnInitializedAsync()
    {
        GetComponents();
    }

    private void GetComponents()
    {
        _types = _me?.GetTypes().Where(s => s.BaseType == typeof(ComponentBase) && s.GetCustomAttribute<RouteAttribute>() == null)
            .ToArray() ?? [];
    }
    
    private static FieldInfo GetPrivateField(Type t, string name)
    {
        foreach (var field in t.GetRuntimeFields())
            Console.WriteLine($"Fields: {field.Name}");

        return null!;
    }
}