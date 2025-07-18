from django.contrib import admin
from .models import Empleado

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido', 'dni', 'salario', 'fecha_creacion']
    list_filter = ['fecha_creacion']
    search_fields = ['nombre', 'apellido', 'dni']
    ordering = ['apellido', 'nombre']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'apellido', 'dni')
        }),
        ('Información Laboral', {
            'fields': ('salario',)
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
