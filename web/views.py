from django.shortcuts import render


def file(request):
    return render(request, 'filenameger.html')

def jobs(request):
    return render(request, 'jobs.html')