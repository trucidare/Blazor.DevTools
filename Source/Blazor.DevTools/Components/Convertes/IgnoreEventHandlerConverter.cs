using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components.Convertes;

public class IgnoreTypeInfConverter : JsonConverter<System.Reflection.TypeInfo>
{
    public override bool CanConvert(Type typeToConvert)
        => typeToConvert == typeof(EventHandler<>);
        
    public override System.Reflection.TypeInfo? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return null!;
    }

    public override void Write(Utf8JsonWriter writer, System.Reflection.TypeInfo value, JsonSerializerOptions options)
    {
    }
}