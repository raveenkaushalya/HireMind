import urllib.request, json
req = urllib.request.Request('http://localhost:5147/api/contact', data=b'{"name":"Test","email":"test@test.com","phone":"","subject":"","message":"hello"}', headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(e.read().decode('utf-8'))
