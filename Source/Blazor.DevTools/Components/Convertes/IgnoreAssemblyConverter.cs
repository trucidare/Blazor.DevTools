using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Blazor.DevTools.Components.Convertes;

public class IgnoreAssemblyConverter : JsonConverter<Assembly>
{
    public override bool CanConvert(Type typeToConvert)
        => typeToConvert == typeof(Type);

    public override Assembly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => null!;

    public override void Write(Utf8JsonWriter writer, Assembly value, JsonSerializerOptions options)
    {
    }
}