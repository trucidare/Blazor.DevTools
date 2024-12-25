using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components;

public partial class DIcon 
{
    [Parameter]
    public string? Class { get; set; }
    
    [Parameter]
    public string? Style { get; set; }
    
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}