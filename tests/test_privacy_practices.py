"""
test_privacy_practices.py
================================================================================
test_privacy_practices.py is a unittest file for functions from privacy_practices.py.
"""

import unittest
import sys
import os
from os import path

from policygenerator.src.constants import Practices
from policygenerator.src.privacy_practices import *


class TestPrivacyPractices(unittest.TestCase):
	

	def test_retrieve_privacy_practice_data(self):
		"""
		Tests that retrieve_privacy_practice_data() correctly creates a dictionary 
		from spec/privacy_practices.yaml
		Compares the output length of the dictrionary to 
		policygenerator.constants.Practices 

		:retrieve_privacy_practice_data() param: none
		:retrieve_privacy_practice_data() return: dic w/ privacy practices enums as keys
		"""
		data = retrieve_privacy_practice_data()
		self.assertEqual(len(data), len(Practices))


	def test_search_root_dir(self):
		"""
		Tests that all of the elements not a part of "Pods" or "Carthage" or 
		third party frameworks are added to the list returned from 
		search_root_dir() 
		Compares the length of the list to the number of items there are in the directory
		
		:search_root_dir() param: root directory (string)
		:search_root_dir() return: list of all files in root directory (list)
		"""
		no_files = 25
		test_app_dir = "testappdir/testapp/"
		path = os.path.join(os.path.abspath(os.path.dirname(__file__)), test_app_dir)  

		res_dir = search_root_dir(path)
		self.assertEqual(len(res_dir), no_files) # check length against predetermined count


	def test_get_pod_loc(self):
		"""
		Tests that get_pod_loc() correctly identifies the number of 
		cocoa pod sdks that match the specification according to get_pod_loc()
		Tests length of returned list against the number of items in the directory

		:get_pod_loc() param: directory of iOS project (string)
		:get_pod_loc() return: list of cocoa pod sk directories (strings)
		"""
		no_dir = 2
		test_app_dir = "testappdir/testapp/"
		path = os.path.join(os.path.abspath(os.path.dirname(__file__)), test_app_dir)  

		res_dir = get_pod_loc(path)
		self.assertEqual(len(res_dir), no_dir) # check length against predetermined count


	def test_get_cart_loc(self):
		"""
		Tests that get_cart_loc() correctly identifies the number of 
		Carthage sdks, in accordance with the spec of get_cart_loc()
		Tests length of returned list against the number of items in the directory

		:get_cart_loc() param: directory of iOS project (string)
		:get_cart_loc() return: list of Carthage sdk directories (strings)
		"""
		no_dir = 5
		test_app_dir = "testappdir/testapp/"
		path = os.path.join(os.path.abspath(os.path.dirname(__file__)), test_app_dir)

		res_dir = get_cart_loc(path)
		self.assertEqual(len(res_dir), no_dir) # check length against predetermined count

	
	def test_grab_third_party_files(self):
		"""
		Tests that grab_third_party_files() grabs the correct number of other sdks
		used in a given project
		Tests length of returned dic against the number of locations given in the list

		:grab_third_party_files() param: list of directories of sdks (list)
		:grab_third_party_files() return: dic containing sdks as keys and directories
										  of sdks as lists (dic)
		"""
		no_dir = 6
		test_app_dir = "testappdir/testapp/sdks/"
		path = os.path.join(os.path.abspath(os.path.dirname(__file__)), test_app_dir)

		res_dir = grab_third_party_files([path])
		self.assertEqual(len(res_dir[path]), no_dir) # check len against predetermined count


	def test_load_third_df(self):
		"""
		Tests that load_third_df() correctly parses the ad networks dataframe
		Tests length of returned dictionary against number of elements in 
		third_parties.yaml

		:load_third_df() param: none
		:load_third_df() return: dic of every SDK along with their type (dic)
		"""
		data = load_third_df()
		self.assertEqual(len(data), 300)


	def test_locate_entitlements_file(self):
		"""
		Tests that locate_entitelment_file identifies entitlements file in directory

		:locate_entitlements_file() param: root directory (string)
		:locate_entitlements_file() return: location of entitlements files (string)
		"""
		import_dir = os.path.abspath(os.path.dirname(__file__))
		test_app_dir = "testappdir/"
		entitlements_dir = "testappdir/testapp/Clients/Entitlements/testapp.entitlements"

		path = os.path.join(import_dir, test_app_dir)
		entitlements = os.path.join(import_dir, entitlements_dir)

		res_dir = locate_entitlements_file(path)
		self.assertEqual(res_dir, entitlements)


	def test_load_data(self):
		"""
		Tests that load_data() correctly accumulates and loads all relavent data 
		utilizing the previous functions in the privacy_practices.py module
		Essentially calls all previous functions one more to time to ensure that
		load_data() runs properly

		:load_data() param: root directory (string)
		:load_data() return: list of cocoa pod sk directories (strings)
		"""
		test_app_dir = "testappdir/testapp/"
		path_dir = os.path.abspath(os.path.dirname(__file__)) 	# location of '/tests' folder
		path = os.path.join(path_dir, test_app_dir)				# full root path

		(fp_info, fp_files, sdk_files, tp_info, entitlements) = load_data(path)
		self.assertEqual(len(fp_info), len(Practices))	# test_retrieve_privacy_practice_data
		self.assertEqual(len(fp_files), 25) 			# test_search_root_dir
		self.assertEqual(len(tp_info), 300)				# test_load_third_df
		self.assertEqual(len(sdk_files), 2 + 5)			# test_grab_third_party_files

		entitlements_dir = "testappdir/testapp/Clients/Entitlements/testapp.entitlements"
		self.assertEqual(entitlements, os.path.join(path_dir, entitlements_dir))
		


if __name__ == '__main__':
	unittest.main()