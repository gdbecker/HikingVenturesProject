# Generated by Django 3.2.5 on 2022-10-11 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hvapp', '0008_history_review'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='history',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together=set(),
        ),
    ]
