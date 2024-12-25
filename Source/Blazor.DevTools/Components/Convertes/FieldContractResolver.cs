using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Components;

namespace Blazor.DevTools.Components.Convertes;


internal class FieldContractResolver : DefaultJsonTypeInfoResolver
{
    private static FieldInfo _componentIdField = typeof(RenderHandle).GetField("_componentId", BindingFlags.Instance | BindingFlags.NonPublic)!;

    public override JsonTypeInfo GetTypeInfo(Type type, JsonSerializerOptions options)
    {
        JsonTypeInfo jsonTypeInfo = base.GetTypeInfo(type, options);
        if (jsonTypeInfo.Kind == JsonTypeInfoKind.Object)
        {
            jsonTypeInfo.Properties.Clear();

            foreach (FieldInfo field in type.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
            {
                if (field.FieldType.Name == "EventHandler`1" 
                    || field.FieldType.Name == "IntPtr"
                    || field.FieldType.Name == "Type"
                    || field.FieldType.FullName!.Contains("TypeInfo")
                    || field.FieldType.FullName!.Contains("MemberInfo")
                    || field.FieldType.FullName!.Contains("RenderFragment`1")
                    || field.FieldType.FullName!.Contains("RenderFragment")
                    || field.FieldType.FullName!.Contains("ConstructorInfo")
                    || field.FieldType.FullName!.Contains("MethodInfo"))
                    continue;
                
                if (field.Name.Contains("__BackingField"))
                    continue;

                if (field.FieldType == typeof(RenderHandle))
                {
                    JsonPropertyInfo jsonPropertyInfo = jsonTypeInfo.CreateJsonPropertyInfo(typeof(int), "__componentId");
                    jsonPropertyInfo.Get = (instance) => 1;
                    jsonPropertyInfo.Set = (instace, value) => { };

                    jsonTypeInfo.Properties.Add(jsonPropertyInfo);
                }
                else
                {
                    JsonPropertyInfo jsonPropertyInfo = jsonTypeInfo.CreateJsonPropertyInfo(field.FieldType, field.Name);
                    jsonPropertyInfo.Get = field.GetValue;
                    jsonPropertyInfo.Set = field.SetValue;

                    jsonTypeInfo.Properties.Add(jsonPropertyInfo);
                }
            }

            foreach (PropertyInfo propInfo in type.GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                if (propInfo.GetCustomAttribute<IgnoreDataMemberAttribute>() is not null)
                    continue;
                
                if (propInfo.PropertyType.Name == "EventHandler`1" 
                    || propInfo.PropertyType.FullName == typeof(Type).FullName 
                    || propInfo.PropertyType.Name == "IntPtr"
                    || propInfo.PropertyType.Name == "Type" 
                    || propInfo.PropertyType.FullName!.Contains("TypeInfo")
                    || propInfo.PropertyType.FullName!.Contains("MemberInfo")
                    || propInfo.PropertyType.FullName!.Contains("RenderFragment`1")
                    || propInfo.PropertyType.FullName!.Contains("RenderFragment")
                    || propInfo.PropertyType.FullName!.Contains("ConstructorInfo")
                    || propInfo.PropertyType.FullName!.Contains("MethodInfo"))
                    continue;


                DataMemberAttribute? attr = propInfo.GetCustomAttribute<DataMemberAttribute>();
                JsonPropertyInfo jsonPropertyInfo = jsonTypeInfo.CreateJsonPropertyInfo(propInfo.PropertyType, attr?.Name ?? propInfo.Name);
                jsonPropertyInfo.Order = attr?.Order ?? 0;
                jsonPropertyInfo.Get = propInfo.CanRead ? propInfo.GetValue : null;
                jsonPropertyInfo.Set = propInfo.CanWrite ? propInfo.SetValue : null;

                jsonTypeInfo.Properties.Add(jsonPropertyInfo);
            }
        }
        
        return jsonTypeInfo;
    }
}
