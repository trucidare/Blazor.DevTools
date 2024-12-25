using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Configuration;

namespace Blazor.DevTools.Components.Content;

public partial class Config 
{
    [Inject]
    public required IConfiguration Configuration { get; set; }
    
    private Dictionary<string, object?> _options = new();

    protected override void OnInitialized()
        => SerializeConfiguration();

    private void SerializeConfiguration()
    {
        var k = Configuration.AsEnumerable();
        foreach (var kv in k)
            if (kv.Value != null)
                _options.Add(kv.Key, kv.Value);
    }
}