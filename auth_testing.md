# Auth Testing Playbook — Devine Intelligence

## Test User Creation
Run in mongosh:
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user@example.com',
  name: 'Test Devotee',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
"
```

## Testing Auth Endpoints
```
curl -X GET "$BACKEND/api/auth/me" -H "Authorization: Bearer $TOKEN"
curl -X GET "$BACKEND/api/user/sadhana" -H "Authorization: Bearer $TOKEN"
curl -X POST "$BACKEND/api/user/sadhana/sync" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"japa_counts":{"ganesha":108},"likhita_counts":{"rama":50}}'
```

## Guest Mode
- Auth is OPTIONAL. Users can use the entire app without signing in.
- All japa/likhita/streak state lives in localStorage by default.
- If a user signs in, on `/api/auth/me` success we merge localStorage → server, then hydrate from server going forward.
- Sign out clears the cookie but preserves localStorage.
