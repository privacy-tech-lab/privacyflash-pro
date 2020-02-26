"""
test_privacy_practices.py
================================================================================
test_privacy_practices.py is a unittest file for functions from privacy_practices.py.
"""

import unittest
import os
from os import path
 
from policygenerator.privacy_practices import retrieve_privacy_practice_data
from policygenerator.privacy_practices import search_root_dir
from policygenerator.constants import Practices



class TestPrivacyPractices(unittest.TestCase):
	
	def test_retrieve_privacy_practice_data(self):
		"""
		- retrieve_privacy_practice_data() correctly creates a dic from spec/privacy_practices.yaml
		  len(retrieve_privacy_practice_data()) = len(string(Practices))
		"""
		# Checks len(retrieve_privacy_data()) (type dic) = # of ele. in constants.Practices
		data = retrieve_privacy_practice_data()
		self.assertEqual(len(data), len(Practices))


	def test_search_root_dir(self):
		"""
		- test_search_root_dir() checks that all of the elements not a part of "Pods" or 
		  "Carthage" or third party framework are added to the output list by comparing 
		  the length of the list to the number of items there are, as counted beforehand. 
		- Also checks that the output matches the prewritten example as in the assert below.
		"""
		test_app_dir = "testappdir"
		path = os.path.abspath(os.path.dirname(__file__)) 	# location of tests folder

		res_dir = search_root_dir(os.path.join(path, test_app_dir)

		self.assertEqual(len(res_dir), ) 	# manually counted files from /tests/testappdir


	# def test_load_data(self):
	# 	"""
	# 	Test that it can do your test
	# 	"""
	#	 root_dir = 
	#	 res = privacy_practices.load_data(root_dir)
	# 	val = analysis.constructor_search(e, p, fp)
	# 	self.assertTrue(1, 2)

if __name__ == '__main__':
	unittest.main()