using System.Reflection;
using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components.Content;

public partial class Pages 
{
    [Inject]
    public required NavigationManager NavManager { get; set; }
    
    private AssemblyName[] _assemblies = [];
    private Assembly _me = Assembly.GetEntryAssembly();
    private List<(string Group, string Template)>  _routes = [];

    protected override async Task OnInitializedAsync()
    {
        _assemblies = Assembly.GetExecutingAssembly()?.GetReferencedAssemblies().ToArray() ?? [];
        GetRoutes();
    }

    private void GetRoutes()
    {
        var types = _me.GetTypes().Where(s => s.GetCustomAttribute<RouteAttribute>() != null).Select(s =>  s.GetCustomAttribute<RouteAttribute>());
        _routes = types.Select(s => (string.Join("/", s.Template.Split("/", StringSplitOptions.TrimEntries).SkipLast(1)),s.Template)).ToList();
    }
    
    private string[] GetGroups()
    {
        List<string> groups = [];
        foreach (var i in _routes)
            if (!groups.Contains(i.Group))
                groups.Add(i.Group);

        groups.Sort((a, b) => string.Compare(a, b, StringComparison.InvariantCultureIgnoreCase));

        return groups.ToArray();
    }
}