function reloadExtensions() {
  chrome.management.getAll(function(extensionList) {
    extensionList.forEach(function(extension) {
      if (extension.type === 'extension' || extension.type === 'hosted_app' || extension.type === 'packaged_app') {
        chrome.management.setEnabled(extension.id, false, function() {
          chrome.management.setEnabled(extension.id, true);
        });
      }
    });
  });
}
