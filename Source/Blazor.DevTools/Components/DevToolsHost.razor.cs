using Blazor.DevTools.Components.Icons;
using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components;

public partial class DevToolsHost
{
    private enum ContentType
    {
        Overview,
        Pages,
        Components,
        RuntimeConfig,
        Modules,
        Plugins,
        Instances
    }
    
    [Inject]
    public required NavigationManager NavigationManager { get; set; }

    private (ContentType Type, string Name, MarkupString Icon)[] _menuItems = [
        new (ContentType.Overview, "Overview", Baseline.Overview),
        new (ContentType.Pages, "Pages", Baseline.Page),
        new (ContentType.Instances, "Instances", Baseline.Components),
        new (ContentType.RuntimeConfig, "Runtime Config", Baseline.Config),
        //new (ContentType.Modules, "Modules", Baseline.Module),
        //new (ContentType.Plugins, "Plugins", Baseline.Plugin)
    ];
    private ContentType _contentType;
    private bool _active;

    private void ToggleDevTools()
    {
        _active = !_active;
        StateHasChanged();
    }

  
}