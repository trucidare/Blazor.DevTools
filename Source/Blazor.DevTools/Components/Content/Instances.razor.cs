using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Blazor.DevTools.Components.Convertes;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.RenderTree;

namespace Blazor.DevTools.Components.Content;

public partial class Instances 
{
    private Dictionary<int, (string TypeName, string Group, string Json)> _foundInstances = [];
    private int _selectedInstanceIndex = -1;
    
    private static JsonSerializerOptions SerializerOptions => new()
    {
        WriteIndented = true,
        Converters = { new IgnoreTypeConverter(), new IgnoreRenderFragmentConverter(), new IgnoreTypeInfConverter(), new IgnoreAssemblyConverter() },
        TypeInfoResolver = new FieldContractResolver(),
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        IncludeFields = true, 
    };

    protected override void OnInitialized()
        => CheckRenderer();

    protected override void OnAfterRender(bool firstRender)
        => CheckRenderer();

    private void CheckRenderer()
    {
        var renderHandleField = typeof(ComponentBase).GetField("_renderHandle", BindingFlags.Instance | BindingFlags.NonPublic);
        var renderHandle = (RenderHandle)renderHandleField?.GetValue(this)!;
        var rendererField = typeof(RenderHandle).GetField("_renderer", BindingFlags.Instance | BindingFlags.NonPublic);
        var renderer = rendererField?.GetValue(renderHandle) as Renderer;

        var fieldInfo = typeof(Renderer).GetField("_componentStateById", BindingFlags.Instance | BindingFlags.NonPublic);
        
        _foundInstances.Clear();
        if (fieldInfo != null)
        {
            // Get the value of the field
            var ok  = (Dictionary<int, ComponentState>)fieldInfo.GetValue(renderer)!;
            foreach (var k in ok)
            {
                var t = k.Value.Component.GetType();
                if (t.FullName!.Contains("Microsoft.AspNetCore.Components") || t.FullName!.Contains("Blazor.DevTools.Components"))
                    continue;
                
                var c = Convert.ChangeType(k.Value.Component, t);
                var j = JsonSerializer.Serialize(c, SerializerOptions);
                
                _foundInstances.Add(k.Key, (t.FullName, string.Join(".", t.FullName.Split(".", StringSplitOptions.TrimEntries).SkipLast(1)), j));
            }
        }
    }

    private string[] GetGroups()
    {
        List<string> groups = [];
        foreach (var i in _foundInstances)
            if (!groups.Contains(i.Value.Group))
                groups.Add(i.Value.Group);

        groups.Sort((a, b) => string.Compare(a, b, StringComparison.InvariantCultureIgnoreCase));

        return groups.ToArray();
    }

    private string GetInstanceJson()
    {
        if (_foundInstances.TryGetValue(_selectedInstanceIndex, out var value))
            return value.Json;

        return string.Empty;
    }

    private void SelectInstance(int instanceIndex)
        => _selectedInstanceIndex = instanceIndex;
}