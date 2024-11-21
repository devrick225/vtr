#!/bin/bash
# 
#  ACT Tool Extraction Script for RedHat Linux (7.x and 8.x) and SuSe Linux (12.x and 15.x)
#
#  
#  REVISION HISTORY:
# ------------------------------------------------------------------------------------
#  Version	 Date			Author			  Activity			
# ------------------------------------------------------------------------------------
#  1.0		01/08/2014	  Prabhala, Suchitra		Script Created 				
#  1.1		15/Mar/2016	  Shashank Ramakrishna		Including /etc/vsftpd/vsftpd.conf, /etc/vsftpd/ftpusers, .shosts
#			22/Apr/2016	  Shashank Ramakrishna		Included 'Extract Application Version' 
#  1.2		29/May/2016	  Shashank Ramakrishna		Script Modified- Modified Code to append Servername in the final zip file created
#			05/25/2016	  Ramakrishna, Shashank		Script Modified- Modified Code to identify if the script is running on the correct OS
#			05/25/2016	  Ramakrishna, Shashank		Script Modified- Modified Code to identify if the script is running with root privilege
#			05/25/2016	  Ramakrishna, Shashank		Script Modified- Modified Code for bug fix related to auto deletion of files
#			06/30/2016	  Ramakrishna, Shashank		Script Modified- Modified Code as file 'cron_perms' did not extract the correct files
#	2.0		02/01/2016	  Antony,Godwin				Script Modified - Modified to extrcat rsyslog for rhel6 and syslog for rhel5
#						  Antony,Godwin				Script Modified - Modified code to capture files in /var/log /etc/pam.d /etc/ssh directories for file_perms.txt
#			02/06/2016    Antony,Godwin             Added new file ACTT_SYSTEM_LINUX_RH.actt as per Req ID: 1533			
# #			03/06/2017	  Antony, Godwin			Script Modified - Script updated to address accounts whose status has been manually locked (!*). Req ID: 1825	
#				  		  Antony,Godwin				Script Modified	- Modified code to capture files under cron and at.
#   2.1     06/22/2017	  Ramakrishna, Shashank		Script Modified- Code updated to correct the issue related to /etc/shadow extraction getting skipped in few environments
#			08/09/2017	  Ramakrishna, Shashank		Script Modified- Code updated to make the extracted output accessible only to the owner
#           08/14/2017	  Antony, Godwin			Scrit Modified - Added Disclaimer to delete the files once it is shared with engagement team
#			11/22/2017	  Antony,Godwin				Script Modified - Script updated to remove that empty temporary folder if the script is terminated manually.ID:1727	
#  15.0		10/05/2017    Antony, Godwin			Commented Extraction of /etc/ftpusers,/etc/vsftpd/ftpusers,/etc/protocols,netstat -tulnp,/etc/vsftpd/vsftpd.conf,.shosts,/etc/xinetd.d and /etc/profile as per Req ID: 1675
#			11/07/2017	  Antony,Godwin				Script Modified- Code added to extract /etc/nsswitch.conf file. as per Req ID:1592
#  16.0		10/24/2018	  Antony, Godwin			Script Modified - Change the attribute name from "Extraction Script Version" to "Extract Script Version". ID : 1999			
#			10/25/2018    Antony, Godwin 			Script Modified - Added code to check the execution of uname -n , removed "rm" related codes and set 700 premission to $FOLDER. ID: 1998
#			11/21/2018	  Antony,Godwin				Script Modified - Added code for the extraction of sudoers.d Req ID: 1920
#			03/01/2019	  Antony, Godwin			Scrit Modified- Added code for extraction of evidence for telnet. Req ID: 2066
#  17.0		09/30/2019	  Antony,Godwin 			Script Modified - Added code for sudoers.d extraction
#           04/01/2020	  Antony,Godwin 			Script Modified - Added code to capture Hostname under ACTT_CONFIG_SETTINGS.actt file.Req ID 2223
#  			04/15/2020	  Antony,Godwin			    Script Modified - Added code for the extraction of /etc/ssh2/sshd2_config. Req ID: 2226
#			04/23/2020	  Antony,Godwin 			Script Modified - Added code for the extraction of /etc/security/pwquality.conf. Req ID: 2168
#  	18.0	04/26/2020	  Antony, Godwin			Script Modified-  Modified code to extract sulog file based on the path location. Req ID: 2328
# 	19.0	10/06/2021	  Antony,Godwin				Script Modified - Added code for the extraction for SUSE ( /etc/common-* files )
#			15/11/2021    ANtony, Godwin			Script Modified - MOdifed code to remove user input while execution.
#  		    16/04/2022	  Dubey, Ritika			    Script Modified- Updated code to extract lastlog, /etc/krb5.conf and /ect/security/access.conf.
#   20.0    05/25/2023    Dubey, Ritika             Script Modified - Updating the extract script to capture the error log and datalog file in the format ACTT_LINUX_errors.txt and ACTT_LINUX_scriptflow.txt respectively.
# 
#   	
# Notice:
# ------------------------------------------------------------------------------------
#	The purpose of this .read only. script is to download data that can be analyzed as part of our audit.  
#	We expect that you will follow your company.s regular change management policies and procedures prior to running the script.
#	To the extent permitted by law, regulation and our professional standards, this script is provided .as is,. 
#	without any warranty, and the Deloitte Network and its contractors will not be liable for any damages relating to this script or its use.  
#	As used herein, .we. and .our. refers to the Deloitte Network entity that provided the script to you, and the .Deloitte Network. refers to 
#	Deloitte Touche Tohmatsu Limited (.DTTL.), the member firms of DTTL, and each of their affiliates and related entities.
#
#
# For more information, contact Deloitte Touche Tohmatsu Limited.  All rights reserved.
#
# ------------------------------------------------------------------------------------

###### Declaration of variables#####
uname -n > /dev/null 2>> /dev/null
if [ $? -eq 0 ];
then
ERRFILE="ACTT_LINUX_errors.txt"
SCRIPTFLOW="ACTT_LINUX_scriptflow.txt"
FOLDER="`uname -n`_`uname`_data.tar"
TARFILE="`uname -n`_ACTT_Output_LINUX.tar"
echo "Folder $FOLDER created successfully"
else
ERRFILE="ACTT_LINUX_errors.txt"
SCRIPTFLOW="ACTT_LINUX_scriptflow.txt"
FOLDER="ACTT_LINUX_data.tar"
TARFILE="ACTT_Output_LINUX.tar"
echo "Folder $FOLDER created successfully"
fi

mkdir ./$FOLDER
if [ $? -ne 0 ]; then 
	echo "Unable to create directory $FOLDER. Exiting script."
	exit
fi

chmod 700 $FOLDER

cd ./$FOLDER
if [ $? -ne 0 ]; then 
	echo "Unable to change the directory to $FOLDER. Exiting script."
	exit
fi

echo $ERRFILE $SCRIPTFLOW $FOLDER $TARFILE 

sleep 10
echo "|^|" > ACTT_CONFIG_FIELDTERMINATOR.actt

##### Function to remove the temporary files created by this script
CLEARALL()
{
	tput smso;tput blink;
	echo -e "\n Script Terminated. Exiting the script on a signal.\n";
	tput rmso;
				
	echo -e "\n Extraction incomplete. Kindly delete the temporary folder  "$FOLDER". \n"
	cd ..
#	rm -rf $FOLDER

sleep 5
}

opt='y'
while test $opt = 'y';do
#### Code to trap the signals
trap ' CLEARALL; exit 1' 1 2 3 15 24

#####Shashank: To check the OS on which the script is running
ver=`uname`
ver1="Linux"
if [[ "$ver" == *"$ver1"* ]]; then
echo "Script Starting on Linux." >> $SCRIPTFLOW
clear
echo "Script Starting on Linux. Please hit enter to continue"
#read STRN
else
clear
echo "This Script is for Linux system and this OS is not Linux." >> $SCRIPTFLOW
echo "This Script is for Linux system and this OS is not Linux. If you hit enter the extraction will continue"
#read STRN
exit 1
fi

##### Shashank: Check for root priviledge
if [ `id -u` == 0 ]; then
echo "This script is being run as root" >> $SCRIPTFLOW
else
echo "Script not run as root" >> $SCRIPTFLOW
clear
echo -e "ABORT Initiated due to insufficient privilege...\nPlease run this script with root privilege."
echo -e "\nScript Execution Failed."
#read STRN
exit 1
fi

##### Extraction of System Information
echo "Extraction of system information  " | tee $SCRIPTFLOW
echo "SettingName nvarchar(max)|^|SettingValue nvarchar(max)"  > ACTT_CONFIG_SETTINGS.actt
echo "Extract Script Version|^|20.0" >> ACTT_CONFIG_SETTINGS.actt
echo  "Hostname|^|`uname -n`" >> ACTT_CONFIG_SETTINGS.actt
echo "Extract Script Start Time|^|`date +\"%D %I:%M:%S %p\"`" >> ACTT_CONFIG_SETTINGS.actt

echo "Extraction completed. Output file is \"ACTT_CONFIG_SETTINGS.actt\" " | tee -a $SCRIPTFLOW

###Checking OS falvor

if [ -f /etc/os-release ]
then
flavor=`cat /etc/os-release |tr -d '"'| grep PRETTY_NAME | awk -F '=' '{print $2}'`
OS1=Red
OS2=SUSE
#echo "$flavor"
if  [[ "$flavor" == *"$OS1"* ]];
then
        echo "Operating System Version|^| "$flavor"" >> ACTT_CONFIG_SETTINGS.actt
        echo "Extract Application Version|^|ACTT LINUXRH" >> ACTT_CONFIG_SETTINGS.actt
		OS=RedHat
else
                if  [[ "$flavor" == *"$OS2"* ]];
        then
                        echo "Operating System Version|^| "$flavor"" >> ACTT_CONFIG_SETTINGS.actt
                        echo "Extract Application Version|^|ACTT LINUXSLES" >> ACTT_CONFIG_SETTINGS.actt
						OS=SLES

        else
                        echo "Operating System Version|^|"$flavor"" >> ACTT_CONFIG_SETTINGS.actt
                        echo "Extract Application Version|^|ACTT LINUX" >> ACTT_CONFIG_SETTINGS.actt
						
                fi
fi
else
echo "Operating System Version|^|`cat /etc/redhat-release`" >> ACTT_CONFIG_SETTINGS.actt
echo "Extract Application Version|^|ACTT LINUXRH" >> ACTT_CONFIG_SETTINGS.actt
fi

echo "SettingName nvarchar(max)|^|SettingValue nvarchar(max)"  > ACTT_SYSTEM_LINUX.actt

#####1,2 Extraction of /etc/passwd and /etc/shadow files
echo "Extraction of /etc/passwd file " 
if [ -f /etc/passwd ]; then
	passlen=`awk -F: '($1 == "root") {print $2}' /etc/passwd`
	if [ $passlen == x ]; then
		if [ -f /etc/shadow ]; then
		cat /etc/passwd > etc_passwd.txt
			echo "Extraction completed. Output file is \"etc_passwd.txt\" " | tee -a $SCRIPTFLOW
		echo "Extraction of /etc/shadow file" | tee -a $SCRIPTFLOW
		awk -F: '{
		if ($2 == "*" || $2 == "!!" || $2 == "!*" || $2 == "!")
			print $1":"$2":"$3":"$4":"$5":"$6":"$7":"$8":"$9
		else
			print $1":"length($2)":"$3":"$4":"$5":"$6":"$7":"$8":"$9}' /etc/shadow > etc_shadow.txt
		echo "Extraction completed. Output file is \"etc_shadow.txt\" " | tee -a $SCRIPTFLOW
		else
		echo "  /etc/shadow file does not exist in the  system"  >> $ERRFILE
		fi
	else
		awk -F: '{
		if ($2 == "*" || $2 == "!!")
			print $1":"$2":"$3":"$4":"$5":"$6":"$7
		else
		print $1":"length($2)":"$3":"$4":"$5":"$6":"$7}' /etc/passwd > etc_passwd.txt
		echo "Extraction completed. Output file is \"etc_passwd.txt\" " | tee -a $SCRIPTFLOW
	fi
else
	echo "  /etc/passwd file does not exist in the system"  >> $ERRFILE
fi

#####3 Extraction of /etc/group file
echo "Extraction of /etc/group file " | tee -a $SCRIPTFLOW
if [ -f /etc/group ]; then
cat /etc/group > etc_group.txt 2>> $ERRFILE
else
echo "/etc/group does not exist in the system" > $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_group.txt\" " | tee -a $SCRIPTFLOW

#####4 Extraction of /etc/securetty file
echo "Extraction of /etc/securetty file " | tee -a $SCRIPTFLOW
if [ -f /etc/securetty ];then
cat /etc/securetty > etc_securetty.txt 2>> $ERRFILE
else
echo "/etc/securetty file does not exist in the system" >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_securetty.txt\" " | tee -a $SCRIPTFLOW

####5 Extraction of /etc/sudoers file
echo "Extraction of /etc/sudoers file " | tee -a $SCRIPTFLOW
if [ -f /etc/sudoers ]; then
cat /etc/sudoers > etc_sudoers.txt 2>> $ERRFILE
else
echo "/etc/sudoers file does not exist in the system"  >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_sudoers.txt\" " | tee -a $SCRIPTFLOW


#########Extraction of sudo files configured under sudoers.d directory#####
echo "Extraction of files under sudoers.d directory"  | tee -a $SCRIPTFLOW
if [ -f /etc/sudoers ]; then
grep "^#includedir" /etc/sudoers | while read line
do
	sudodir="/${line#*/}"
	if [ -d $sudodir ]; then
		ls $sudodir | while read file
		do
			fullpath="$sudodir/$file"
			echo "$fullpath:"
			cat $fullpath
			echo -e "--------------------------------------------------------"
		done >> etc_sudoersd_files.txt
	else
		echo "$sudodir directory does not exist in the system " >> $ERRFILE
	fi
done
echo -e "Extraction completed. Output file is \"etc_sudoersd_files.txt\"\n" | tee -a $SCRIPTFLOW
else
echo "/etc/sudoers file does not exist in the system"  >> $ERRFILE 
fi

#########Extraction of sudo files configured under #include from sudoers file#####
echo "Extraction of files under #include from sudoers file"
if [ -f /etc/sudoers ]; then
grep -w "^#include" /etc/sudoers | while read line
do
        sudofile="/${line#*/}"
        echo "$sudofile"
        if [ -f $sudofile ]; then
                echo "$sudofile:" >> etc_sudoers_files.txt
                cat $sudofile >> etc_sudoers_files.txt
                echo -e "-------------------------------------------------------- \n" >> etc_sudoers_files.txt
                else
                echo ""$sudofile" not configured for sudo access" >> $ERRFILE
                fi
done
echo -e "Extraction completed. Output file is \"etc_sudoers_files.txt\"\n" | tee -a $SCRIPTFLOW
else
echo "/etc/sudoers file does not exist in the system \n " >> $ERRFILE
fi


####6 Extraction of /etc/login.defs command
echo " Extraction of /etc/login.defs file " | tee -a $SCRIPTFLOW
if [ -f /etc/login.defs ]; then
cat /etc/login.defs > etc_login_defs.txt
else
echo "/etc/login.defs file does not exist in the system " >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_login_defs.txt\" " | tee -a $SCRIPTFLOW

####7 Extraction of /etc/pam.d command
echo " Extraction of /etc/pam.d file " | tee -a $SCRIPTFLOW
if [ -d /etc/pam.d ]; then
ls /etc/pam.d | while read file
do
	pamd="/etc/pam.d/${file#*/}"
	if [ -d $pamd ]; then
		ls $pamd | while read files
		do 
			fullpath="$pamd/$files"
			if [ -d $fullpath ]; then
				continue
			fi
			echo "$fullpath:"
			cat $fullpath
			echo -e "--------------------------------------------------------" >> etc_pam_d.txt
		done >> etc_pam_d.txt
	else
		echo "$pamd" >> etc_pam_d.txt
		cat $pamd >> etc_pam_d.txt
		echo -e "--------------------------------------------------------" >> etc_pam_d.txt
	fi
done
echo -e "Extraction completed. Output file is \"etc_pam_d.txt\"\n" | tee -a $SCRIPTFLOW
else
echo "/etc/pam.d file does not exist in the system"  >> $ERRFILE 
fi

####8 Extraction of /etc/pam files  for RHEL and SuSe

if [ $OS == SLES ] ;
then 
	if [ -f /etc/pam.d/common-auth ]; then
		cat /etc/pam.d/common-auth > etc_pamd_system_auth.txt
		echo "Extraction completed. Output file for SUSE \"etc_pamd_common_auth.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/etc/pam.d/common-auth file does not exist in the system " >> $ERRFILE
	fi
	if [ -f /etc/pam.d/common-password ]; then
		cat /etc/pam.d/common-password >> etc_pamd_system_auth.txt
		echo "Extraction completed. Output file for SUSE \"etc_pamd_common_passwd.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/etc/pam.d/common-auth file does not exist in the system " >> $ERRFILE
	fi
	if [ -f /etc/pam.d/common-session ]; then
		cat /etc/pam.d/common-session >> etc_pamd_system_auth.txt
		echo "Extraction completed. Output file for SUSE \"etc_pamd_common_session.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/etc/pam.d/common-auth file does not exist in the system " >> $ERRFILE
	fi
	if [ -f /etc/pam.d/common-account ]; then
		cat /etc/pam.d/common-account >> etc_pamd_system_auth.txt
		echo "Extraction completed. Output file for SUSE \"etc_pamd_common_account.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/etc/pam.d/common-auth file does not exist in the system " >> $ERRFILE
	fi
		
	if [ -f /var/log/messages ]; then
		cat /var/log/messages |grep su: > var_log_secure.txt 2>> $ERRFILE
		echo "Extraction completed. Output sulog file for SuSe is \"etc_log_secure.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/var/log/messages file does not exist for SuSe"  >> $ERRFILE 
	fi
	
	if [ -f /var/log/messages ]; then
		cat /var/log/messages |grep sudo: > var_log_sudolog.txt 2>> $ERRFILE
		echo "Extraction completed. Output sulog file for SuSe is \"etc_log_sudolog.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/var/log/messages file does not exist for SuSe"  >> $ERRFILE 
	fi
	
	if [ -f /var/log/messages ]; then
		cat /var/log/messages |grep cron: > var_log_cron.txt 2>> $ERRFILE
		echo "Extraction completed. Output sulog file for SuSe is \"etc_log_cron.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/var/log/messages file does not exist for SuSe"  >> $ERRFILE 
	fi
		
else
	if [ -f /etc/pam.d/system-auth ]; then
		cat /etc/pam.d/system-auth > etc_pamd_system_auth.txt
		echo "Extraction completed. Output file is \"etc_pamd_system_auth.txt\" " | tee -a $SCRIPTFLOW
	else
		echo "/etc/pam.d/system-auth file does not exist in the system " >> $ERRFILE
	fi
fi


####9,10 Extraction of services from /etc/xinetd.conf file and files from /etc/xinetd.d directory
#echo "Extraction of service files from /etc/xinetd.d directory " | tee -a $SCRIPTFLOW
echo "Extraction of /etc/xinetd.conf file " | tee -a $SCRIPTFLOW
if [ -f /etc/xinetd.conf ];then
#echo "/etc/xinetd.conf: "
cat /etc/xinetd.conf > etc_xinetd_conf.txt
else
echo "/etc/xinetd.conf does not exist in the system " >> $ERRFILE
fi
#if [ -d /etc/xinetd.d ]; then
#ls /etc/xinetd.d/*| while read FILE
#do
#echo "$FILE:"
#cat $FILE
#done >> etc_xinetd_files.txt
#else
#echo "/etc/xinetd.d directory does not exist in the system " >> $ERRFILE
#fi
echo "Extraction completed. Output file is \"etc_xinetd_files.txt\" " | tee -a $SCRIPTFLOW

#####11 Extraction of /var/log/sudolog file
echo "Extraction of sudolog file "
if [ -f /var/log/sudo.log ]; then
cat /var/log/sudo.log > var_log_sudolog.txt 2>> $ERRFILE
else
echo "/var/log/sudo.log file does not exist"  >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_log_sudolog.txt\" " | tee -a $SCRIPTFLOW


#####12 Extraction of /var/log/secure file -- same as Sulog in LINUX
echo "Extraction of secure file "
sulogfunction()
{
if [ -f /var/log/secure ]; then
        cat /var/log/secure > var_log_secure.txt 2>> $ERRFILE
        else
        echo "Sulog file does not exist" 2>> $ERRFILE
        fi
        echo -"Extraction completed. Output file is \"var_log_secure.txt\""
}
if [ -f /etc/login.defs ]; then
file=`cat /etc/login.defs | grep "^[^#]" | grep SULOG_FILE | awk -F= '{ print $2}'`
        echo  "The Log file configured in the server is $file."  | tee -a $SCRIPTFLOW
        if [ -f "$file" ]; then
                #echo "$final"
                cat $file > var_log_secure.txt 2>> $ERRFILE
                echo " Extraction Completed.Output log file $file."  | tee -a $SCRIPTFLOW
        else
                sulogfunction
        fi
else
                sulogfunction
fi


#####13 Extraction of /etc/hosts.equiv file
echo "Extraction of /etc/hosts.equiv file "
if [ -f /etc/hosts.equiv ]; then
cat /etc/hosts.equiv > etc_hosts_equiv.txt 2>> $ERRFILE
else
echo "/etc/hosts.equiv file does not exist"  >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_hosts_equiv.txt\" " | tee -a $SCRIPTFLOW

####14 Extraction of .rhosts files from users' home directories
echo "Extraction of .rhosts files " | tee -a $SCRIPTFLOW
while read line
do
homes=`echo $line|cut -d: -f6 2>> $ERRFILE`
users=`echo $line|cut -d: -f1 2>> $ERRFILE`
	if [ -f $homes/.rhosts ];then
	echo "  .rhosts file found in user \"$users\" home directory - $homes:"
	cat $homes/.rhosts 2>> $ERRFILE
	else
	echo " .rhosts file does not exist in user \"$users\" home directory - $homes" >> $ERRFILE 
	fi
done </etc/passwd > rhosts.txt
echo "Extraction completed. Output file is \"rhosts.txt\" " | tee -a $SCRIPTFLOW

#####14.1 Shashank:20/Mar/2016 Extraction of .shosts  files from users' home directories
#echo "Extraction of .shosts files " | tee -a $SCRIPTFLOW
#find / -xdev -name .shosts -print -exec ls -la {} \; -exec cat {} \; > shosts.txt 2>> $ERRFILE
#echo "Extraction completed. Output file is \"shosts_Sh.txt\" " | tee -a $SCRIPTFLOW

#####15 Extraction of at.allow file
echo "Extraction of at.allow file "
if [ -f /etc/at.allow ]; then
	cat /etc/at.allow > etc_at_allow.txt 2>> $ERRFILE
else
	echo "/etc/at.allow file does not exist " >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_at_allow.txt\" " | tee -a $SCRIPTFLOW

#####16 Extraction of at.deny file
echo "Extraction of at.deny file "
if [ -f /etc/at.deny ]; then
	cat /etc/at.deny > etc_at_deny.txt 2>> $ERRFILE
else
	echo "/etc/at.deny file does not exist " >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_at_deny.txt\" " | tee -a $SCRIPTFLOW

#####17 Extraction of cron.deny file
echo "Extraction of cron.deny file "
if [ -f /etc/cron.deny ]; then
	cat /etc/cron.deny > etc_cron_deny.txt 2>> $ERRFILE
else
	echo "/etc/cron.deny file does not exist " >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_cron_deny.txt\" " | tee -a $SCRIPTFLOW

#####18 Extraction of cron.allow file
echo "Extraction of cron.allow file "
if [ -f /etc/cron.allow ]; then
	cat /etc/cron.allow > etc_cron_allow.txt 2>> $ERRFILE
else
	echo "/etc/cron.allow file does not exist " >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"etc_cron_allow.txt\" " | tee -a $SCRIPTFLOW

#####19 Extraction of cron job files
echo "Extraction of cron job files " | tee -a $SCRIPTFLOW
ls -l /var/spool/cron/ | grep -v "total" | grep -v "insgesamt" > var_spool_cron_crontabs.txt 2>> $ERRFILE 

#####20 Extraction of at job files
echo "Extraction of at job files " | tee -a $SCRIPTFLOW
ls -l /var/spool/at/ | grep -v "total" | grep -v "insgesamt" > var_spool_cron_atjobs.txt 2>> $ERRFILE 

#####21 Extraction of access permissions of critical files
echo "Extracting permissions of critical files " | tee -a $SCRIPTFLOW
for dir in "/ /bin /sbin /usr/bin /usr /etc /var /var/log /etc/pam.d /etc/ssh   "
do ls -l $dir 2>> $ERRFILE; done > file_perms.txt
echo "Extraction completed. Output file is \"file_perms.txt\" " | tee -a $SCRIPTFLOW

#####22 Extraction of installed softwares history
echo "Installed softwares history " | tee -a $SCRIPTFLOW
rpm -qai > software_history.txt 2>> $ERRFILE


#####23 Extraction of syslog/rsyslog conf file
echo "Extracting syslog/rsyslog files " | tee -a $SCRIPTFLOW
if [ -f /etc/syslog.conf ];
then
cat /etc/syslog.conf > etc_syslog_conf.txt 2>> $ERRFILE
echo "Extraction completed. Output file is \"etc_syslog_conf.txt\" " | tee -a $SCRIPTFLOW
elif [ -f /etc/rsyslog.conf ];
then
cat /etc/rsyslog.conf > etc_syslog_conf.txt 2>> $ERRFILE
echo "Extraction completed. Output file is \"etc_rsyslog_conf.txt\" " | tee -a $SCRIPTFLOW
else
echo "/etc/rsyslog.conf and /etc/syslog.conf file does not exist" 2>> $ERRFILE
fi


#####24 Extracting the first 100 lines of /var/log/messages file
if [ -f /var/log/messages ];then
cat /var/log/messages > var_log_messages.txt
else
	echo "/var/log/messages does not exist"
fi

#####25 Extraction of /etc/ssh/sshd_config
echo "Extraction of /etc/ssh/sshd_config file "
if [ -f /etc/ssh/sshd_config ]; then
cat /etc/ssh/sshd_config > etc_ssh_sshd_config.txt 2>> $ERRFILE
else
echo "/etc/ssh/sshd_config does not exist in the system " >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_ssh_sshd_config.txt\" " | tee -a $SCRIPTFLOW

#####26 Extraction of /var/log/cron file
echo "Extraction of /var/log/cron file "
if [ -f /var/log/cron ]; then
	cat /var/log/messages |grep cron > var_log_cron.txt 2>> $ERRFILE
else
	echo "/var/log/cron file does not exist " >> $ERRFILE 
fi
echo "Extraction completed. Output file is \"var_log_cron.txt\" " | tee -a $SCRIPTFLOW

#####27 Extraction of ftpusers file
#echo "Extraction of ftpusers file "
#if [ -f /etc/ftpusers ]; then
#	cat /etc/ftpusers > etc_ftpusers.txt 2>> $ERRFILE
#else
#	echo "/etc/ftpusers file does not exist " >> $ERRFILE 
#fi
#echo "Extraction completed. Output file is \"etc_ftpusers.txt\" " | tee -a $SCRIPTFLOW

###### Shashank 18/Mar/2016: Update for VSFTPD folder
#echo "Extraction of ftpusers file "
#if [ -f /etc/vsftpd/ftpusers ]; then
#	cat /etc/vsftpd/ftpusers > etc_vsftpd_ftpusers.txt 2>> $ERRFILE
#else
#	echo "/etc/vsftpd/ftpusers file does not exist " >> $ERRFILE 
#fi
#echo "Extraction completed. Output file is \"etc_vsftpd_ftpusers.txt\" " | tee -a $SCRIPTFLOW

##########28 Script to extract access permissions of the files located in /etc/cron.d & /var/spool/cron/ directories ##########
### Shashank: Modified code to extract missing information from the framework
echo "  File permissions of /var/adm/cron, /var/spool/cron & /var/spool/at directories" | tee -a  $SCRIPTFLOW
ls -la /var/spool/cron/* /var/spool/at/* > cron_perms.txt 2>> $ERRFILE
ls -la /etc/cron* >> cron_perms.txt 2>> $ERRFILE
ls -la /etc/at* >> cron_perms.txt 2>> $ERRFILE
echo "  Extraction Completed. Output file is \"cron_perms.txt\" " | tee -a  $SCRIPTFLOW

##########29 Script to extract the umask values from all '.profile' files of the users ##########

echo "   Extraction of umask values from user's home directories"
while read line; do
home=`echo $line|cut -d ":" -f6`
if [ -f $home/.profile ]; then
	name=`echo $line|cut -d ":" -f1`
	u_value=`cat $home/.profile |awk '/umask/ {print $2}'`
	if [ x"$u_value" != 'x' ]; then echo "$name $u_value";fi
fi
done < /etc/passwd > user_mask.txt 2>> $ERRFILE
echo "  Extraction completed. Output file is \"user_mask.txt\" " | tee -a $SCRIPTFLOW


#####30 Extraction of /etc/profile file
#echo "Extraction of /etc/profile file " | tee -a $SCRIPTFLOW
#if [ -f /etc/profile ]; then
#cat /etc/profile > etc_profile.txt 2>> $ERRFILE
#else
#echo "/etc/profile file does not exist"  >> $ERRFILE 
#fi
#echo "Extraction completed. Output file is \"etc_profile.txt\" " | tee -a $SCRIPTFLOW

#####31 Extraction of /etc/services file
#echo "Extraction of /etc/services file "
#if [ -f /etc/services ]; then
#cat /etc/services > etc_services.txt 2>> $ERRFILE
#else
#echo "/etc/services file does not exist"  >> $ERRFILE 
#fi

#echo "Extraction completed. Output file is \"etc_services.txt\" " | tee -a $SCRIPTFLOW
#####32 Extraction of /etc/protocols file
#echo "Extraction of /etc/protocols file "
#if [ -f /etc/protocols ]; then
#cat /etc/protocols > etc_protocols.txt 2>> $ERRFILE
#else
#echo "/etc/protocols file does not exist "  >> $ERRFILE 
#fi
#echo "Extraction completed. Output file is \"etc_protocols.txt\" " | tee -a $SCRIPTFLOW

#####33 Extraction of listening_ports.txt file
#echo "Extraction of listening_ports.txt file\n" | tee -a $SCRIPTFLOW
	#netstat -tulpn >> listening_ports.txt 2>> $ERRFILE 

##########34 Shashank 18/Mar/2016: Script to extract /etc/vsftpd/vsftpd.conf file ##########
#echo "Extraction of /etc/vsftpd/vsftpd.conf file "
#if [ -f /etc/vsftpd/vsftpd.conf ]; then
#	cat /etc/vsftpd/vsftpd.conf > etc_vsftpdconf.txt 2>> $ERRFILE
#else
#	echo "/etc/vsftpd/vsftpd.conf file does not exist " >> $ERRFILE 
#fi
#echo "Extraction completed. Output file is \"etc_vsftpdconf.txt\" " | tee -a $SCRIPTFLOW

#######35 Extraction of /etc/nsswitch.conf file#####
echo "Extracting nsswitch.conf file content " | tee -a $SCRIPTFLOW
if [ -f /etc/nsswitch.conf ]; then
cat /etc/nsswitch.conf > etc_nsswitch_conf.txt 2>> $ERRFILE
else
echo "/etc/nsswitch.conf file does not exists in the system" 2>> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_nsswitch_conf.txt\" " | tee -a $SCRIPTFLOW


##### 36. Verification for Telnet service#######
echo "Extraction for  Telnet service"
telnet localhost < ACTT_CONFIG_FIELDTERMINATOR.actt 2>&1 > telnet_status.txt | tee -a $SCRIPTFLOW
grep -q "Connected" telnet_status.txt
if [ $? == 0 ]; then
echo "Telnet is Enabled" >>  telnet_status.txt | tee -a $SCRIPTFLOW
else
echo "Telnet is Not Enabled" >> telnet_status.txt | tee -a $SCRIPTFLOW
fi

##### 37.Extraction of pwquality.conf file#######

echo "Extracting pwquality.conf file content(applicable only for RHEL7)" | tee -a $SCRIPTFLOW
if [ -f /etc/security/pwquality.conf ]; then
cat /etc/security/pwquality.conf > etc_security_pwquality_conf.txt 2>> $ERRFILE
else
echo "/etc/security/pwquality.conf  file does not exists in the system" >> $ERRFILE
fi
echo -e "Extraction completed. Output file is \"etc_security_pwquality_conf.txt\" " | tee -a $SCRIPTFLOW

##### 38.Extraction of /etc/ssh2/sshd2_config #######

echo "Extracting /etc/ssh2/sshd2_config file" | tee -a $SCRIPTFLOW
if [ -f /etc/ssh2/sshd2_config ]; then
cat /etc/ssh2/sshd2_config > etc_ssh2_sshd2_config.txt >> $ERRFILE
else
echo "/etc/ssh2/sshd2_config  file does not exists in the system" >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_ssh2_sshd2_config.txt\"" | tee -a $SCRIPTFLOW

##### 39.Extraction of /etc/security/access.conf #######

echo "Extracting /etc/security/access.conf file" | tee -a $SCRIPTFLOW
if [ -f /etc/security/access.conf ]; then
cat /etc/security/access.conf > etc_security_access_conf.txt 2>> $ERRFILE
else
echo "/etc/security/access.conf file does not exists in the system" >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_security_access_conf.txt\"" | tee -a $SCRIPTFLOW

##### 40.Extraction of /etc/krb5.conf #######

echo "Extracting /etc/krb5.conf file" | tee -a $SCRIPTFLOW
if [ -f /etc/krb5.conf ]; then
cat /etc/krb5.conf > etc_krb5_conf.txt 2>> $ERRFILE
else
echo "/etc/krb5.conf file does not exists in the system" >> $ERRFILE
fi
echo "Extraction completed. Output file is \"etc_krb5_conf.txt\"" | tee -a $SCRIPTFLOW

##### 41.Extraction of lastlog (applicable for RH & SLES 15.x)#######

echo "Extracting lastlog file" | tee -a $SCRIPTFLOW
lastlog > lastlog.txt 2>> $ERRFILE
if [ $? -eq 0 ];
then 
echo "Extraction completed. Output file is \"lastlog.txt\"" | tee -a $SCRIPTFLOW
else
echo "lastlog file does not exists in the system" >> $ERRFILE
fi

##### Listing of .txt files and their number of lines 
echo "FileName Nvarchar(max)|^|RecordCount NUMERIC"  > ACTT_CONFIG_RECORDCOUNT.actt
for i in `ls *.txt`
do
LINES=`awk 'END{print NR}' $i`
echo "$i|^|$LINES" >> ACTT_CONFIG_RECORDCOUNT.actt 
done
echo "Extraction Script End Time|^|`date +\"%D %I:%M:%S %p\"`" >> ACTT_CONFIG_SETTINGS.actt

##### Code to move  all the generated files to a folder and then to archive

tar --format=gnu -cf $TARFILE *
#compress $TARFILE

if [ -f "$TARFILE" ];
then
mv $TARFILE ./..
else
echo -e "\n tar file not created hence terminating the execution"
fi
#cp $TARFILE ./..
cd ..
chmod 700 $TARFILE


##### Cleaning up the temp files and/or directories created within the script
#rm -r ./$FOLDER
	opt='n'
done

### Discalimer to remove the extracted zip file after transferring ###

echo -e "\n\t\t\t\t********** IMPORTANT: The file has successfully generated as $TARFILE **********\n\t\t******* Please make sure to delete the generated file "$TARFILE" and directory "$FOLDER"  from the server after you have provided the file to Deloitte Engagement Team******* \n "
