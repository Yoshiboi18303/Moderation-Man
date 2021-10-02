function check_permissions(member, p_array) {
  var pa = []
  for(var p in p_array) {
    if(p == 0) {
      i = 0;
    } else {
      i = p - 1
    }
    if(!member.permissions.has(p)) {
      var not_allowed = `${p_array[i]} - Not Allowed.`
      pa.push(not_allowed)
    } else {
      var allowed = `${p_array[i]} - Allowed!`
      pa.push(allowed)
    }
  }
  return pa.join("\n")
  }
}