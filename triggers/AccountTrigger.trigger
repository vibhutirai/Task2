trigger AccountTrigger on Account (before insert, before update) {
      Set<String> accountNameSet = new Set<String>();
    for (Account acc : Trigger.new) {
        if ((Trigger.isInsert || (Trigger.isUpdate && acc.Name != Trigger.oldMap.get(acc.Id).Name))) {
            accountNameSet.add(acc.Name);
        }
    }
    if (accountNameSet.size() > 0) {
        List<Account> accountList = [SELECT Id, Name FROM Account WHERE NAME IN :accountNameSet];
        if (accountList.size() > 0 ) {
            accountNameSet = new Set<String>();
            for (Account acc : accountList) {
                accountNameSet.add(acc.Name);  
            }
            for (Account acc : Trigger.new) {
                if (accountNameSet.contains(acc.Name)) {
                    acc.addError('Duplicate Account');
                }
            }   
        }  
    }

}