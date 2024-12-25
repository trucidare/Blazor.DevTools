using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components.Convertes;

public class IgnoreRenderFragmentConverter : JsonConverter<RenderFragment>
{
    public override bool CanConvert(Type typeToConvert)
        => typeToConvert == typeof(RenderFragment);

    public override RenderFragment? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => null!;

    public override void Write(Utf8JsonWriter writer, RenderFragment value, JsonSerializerOptions options)
    {
    }
}